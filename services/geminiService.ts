import { Agent, ChatMessage, ResponseMode, UserProfile } from '../types';

const API_BASE_URL = 'https://wercia-102566788969.europe-west4.run.app'; // API calls will point to the live backend

type BackendChatRequest = {
  question: string;
  chat_history: { role: 'user' | 'ai'; content: string }[];
  selected_agent_ids: string[];
  response_mode: ResponseMode;
  user_profile: UserProfile;
  image_data?: { mime_type: string; data: string };
};

type BackendSummaryRequest = {
    chat_history: { role: 'user' | 'ai'; content: string }[];
    selected_agent_ids: string[];
    user_profile: UserProfile;
}

type BackendSummaryResponse = {
    summary?: string;
    error?: string;
}

export type ImageData = {
  mimeType: string;
  data: string;
}

export type StreamChunk = {
    text?: string;
    sources?: ChatMessage['sources']; // Keep for potential future use, though stream won't contain it now
    error?: string;
}

function formatHistoryForBackend(history: ChatMessage[]): { role: 'user' | 'ai'; content: string }[] {
    return history
        .filter(msg => msg.role !== 'system' && msg.content !== '__TYPING__' && !msg.isSummary)
        .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'ai',
            content: msg.rawContent || msg.content,
        }));
}

export async function* getResponseStream(
  question: string,
  agents: Agent[],
  history: ChatMessage[],
  userProfile: UserProfile,
  agentWebSearchConfig: Record<string, boolean>,
  responseMode: ResponseMode,
  image?: ImageData,
): AsyncGenerator<StreamChunk> {
    
    const endpoint = `${API_BASE_URL}/api/analyze-zeeland`;

    const requestBody: BackendChatRequest = {
        question: question,
        chat_history: formatHistoryForBackend(history),
        selected_agent_ids: agents.map(a => a.id),
        response_mode: responseMode,
        user_profile: userProfile,
        ...(image && { image_data: { mime_type: image.mimeType, data: image.data } }),
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok || !response.body) {
            const errorText = await response.text();
            console.error("Backend error response:", errorText);
            try {
                const errorBody = JSON.parse(errorText);
                 throw new Error(errorBody.error || `HTTP error! Status: ${response.status}`);
            } catch {
                 throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value);
            accumulatedText += textChunk;
            yield { text: accumulatedText };
        }

    } catch (error) {
        console.error('Fout bij het ophalen van de data van de backend API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Een onbekende fout is opgetreden.';
        yield { error: `Backend Connectie Fout: ${errorMessage}` };
        throw error;
    }
}


export async function getSummary(
    chat: ChatMessage[],
    agents: Agent[],
    userProfile: UserProfile,
): Promise<string> {
    const endpoint = `${API_BASE_URL}/api/summarize`;
    
    const requestBody: BackendSummaryRequest = {
        chat_history: formatHistoryForBackend(chat),
        selected_agent_ids: agents.map(a => a.id),
        user_profile: userProfile,
    };
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorBody = JSON.parse(errorText);
                throw new Error(errorBody.error || `HTTP error! Status: ${response.status}`);
            } catch {
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
        }

        const result: BackendSummaryResponse = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        if (result.summary) {
            return result.summary;
        }

        return "Er kon geen samenvatting worden gegenereerd.";
    } catch (error) {
        console.error('Fout bij het ophalen van de samenvatting:', error);
        throw error;
    }
}

export async function checkBackendStatus(): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
        const response = await fetch(`${API_BASE_URL}/api/status`, {
            method: 'GET',
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return data.status === 'connected';
        }
        return false;
    } catch (error) {
        clearTimeout(timeoutId);
        console.warn('Backend status check failed:', error);
        return false;
    }
}