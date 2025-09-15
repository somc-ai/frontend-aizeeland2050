import React, { useState, useCallback } from 'react';
import { Agent, ChatMessage, Scenario, ResponseMode, UserProfile } from '../types';
import { getResponseStream, getSummary } from '../services/geminiService';
import { logEvent } from '../services/analyticsService';
import { AGENTS } from '../data/agents';

declare const marked: { parse: (markdown: string) => string; };

const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

type UseChatHandlerProps = {
    userId: string;
    currentScenario: Scenario | null;
    updateCurrentScenario: (updates: Partial<Scenario>) => void;
    setScenarios: React.Dispatch<React.SetStateAction<Scenario[]>>;
    activeAgents: Agent[];
    responseMode: ResponseMode;
    userProfile: UserProfile;
    imageFile: File | null;
    resetImage: () => void;
    agentWebSearchConfig?: Record<string, boolean>;
};

export function useChatHandler({
  userId,
  currentScenario,
  updateCurrentScenario,
  setScenarios,
  activeAgents,
  responseMode,
  userProfile,
  imageFile,
  resetImage,
  agentWebSearchConfig,
}: UseChatHandlerProps) {
  const [loading, setLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSend = useCallback(async (question: string) => {
    if ((!question.trim() && !imageFile) || !currentScenario) return;

    const currentScenarioId = currentScenario.id;

    logEvent('prompt_sent', {
        userId,
        scenarioId: currentScenarioId,
        prompt: question,
        responseMode,
        activeAgentIds: activeAgents.map(a => a.id),
        imageAttached: !!imageFile,
    });

    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    
    const userMessageContent = question.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />");
    const userMessage: ChatMessage = { 
      id: `msg_${Date.now()}`, 
      role: 'user', 
      content: userMessageContent, 
      rawContent: question,
      imageUrl: imageUrl,
    };
    
    if (activeAgents.length === 0) {
      const warningMessage: ChatMessage = { id: `msg_${Date.now()}_ai`, role: 'ai', content: 'Selecteer alstublieft ten minste één expert om uw vraag te beantwoorden.', rawContent: 'Selecteer alstublieft ten minste één expert om uw vraag te beantwoorden.'};
      updateCurrentScenario({ chat: [...currentScenario.chat, userMessage, warningMessage] });
      return;
    }
    
    setLoading(true);
    const placeholderMessageId = `msg_${Date.now()}_ai`;
    const loadingMessage: ChatMessage = { id: placeholderMessageId, role: 'ai', content: '__TYPING__', rawContent: '' };
    
    updateCurrentScenario({ chat: [...currentScenario.chat, userMessage, loadingMessage] });

    try {
        const imageData = imageFile ? await fileToBase64(imageFile) : undefined;
        const agentConfig = agentWebSearchConfig ?? {};

        // Create a history snapshot for the backend that includes the new user message.
        // `currentScenario.chat` is stale here and does not include `userMessage`.
        const historyForBackend = [...currentScenario.chat, userMessage];

        const stream = getResponseStream(question, activeAgents, historyForBackend, userProfile, agentConfig, responseMode, imageData);

        let accumulatedRawContent = '';
        let successfullyParsedOnce = false;
        let finalSources: ChatMessage['sources'] | undefined = undefined;

        for await (const chunk of stream) {
            if (chunk.error) throw new Error(chunk.error);
            if (!chunk.text) continue;
            
            accumulatedRawContent = chunk.text;
            
            try {
                const parsed = JSON.parse(accumulatedRawContent);
                if (parsed && typeof parsed === 'object' && parsed.data) {
                    const agentResponses = Object.entries(parsed.data as Record<string, string>);
                    
                    const formattedContent = agentResponses.length > 0
                        ? agentResponses.map(([agentId, responseText]) => {
                            const agent = AGENTS.find(a => a.id === agentId);
                            const agentName = agent ? agent.name : agentId.charAt(0).toUpperCase() + agentId.slice(1);
                            return `### ${agentName}\n\n${responseText}`;
                        }).join('\n\n<hr class="my-6 border-slate-200">\n\n')
                        : 'Geen analyse beschikbaar van de experts.';
                    
                    if (parsed.sources && Array.isArray(parsed.sources)) {
                        finalSources = parsed.sources;
                    }
                    
                    setScenarios(prevScenarios => prevScenarios.map(s => {
                        if (s.id !== currentScenarioId) return s;
                        return { 
                            ...s, 
                            chat: s.chat.map(msg => msg.id === placeholderMessageId ? {
                                ...msg,
                                content: typeof marked !== 'undefined' ? marked.parse(formattedContent) : formattedContent,
                                rawContent: accumulatedRawContent,
                                sources: finalSources ?? msg.sources,
                            } : msg)
                        };
                    }));
                    successfullyParsedOnce = true;
                }
            } catch (e) {
                // Not valid JSON yet, we are still streaming. Continue showing typing indicator.
            }
        }

        // After stream, if we never managed to parse it as our special JSON,
        // but we have content, treat it as plain text. This handles plain text errors.
        if (!successfullyParsedOnce && accumulatedRawContent) {
             setScenarios(prevScenarios => prevScenarios.map(s => {
                if (s.id !== currentScenarioId) return s;
                return { 
                    ...s, 
                    chat: s.chat.map(msg => msg.id === placeholderMessageId ? {
                        ...msg,
                        content: typeof marked !== 'undefined' ? marked.parse(accumulatedRawContent) : accumulatedRawContent,
                        rawContent: accumulatedRawContent,
                    } : msg)
                };
            }));
        }


        logEvent('response_received', {
            userId,
            scenarioId: currentScenarioId,
            responseMode,
            hasError: false,
            sourceCount: finalSources?.length ?? 0,
            responseLength: accumulatedRawContent.length,
        });

    } catch (error) {
      console.error("Error handling send:", error);
      const err = error as Error;
      
      logEvent('response_received', {
        userId,
        scenarioId: currentScenarioId,
        responseMode,
        hasError: true,
        error: err.message,
      });

      const errorMessageString = err.message ? err.message.toLowerCase() : '';
      let errorText = `Sorry, er is iets misgegaan: ${err.message || 'Onbekende fout'}`;

      if (errorMessageString.includes('429') || errorMessageString.includes('resource_exhausted')) {
        errorText = 'De dienst is momenteel overbelast. Probeer het over een paar minuten opnieuw.';
      } else if (errorMessageString.includes('api_key')) {
        errorText = 'De API-sleutel is niet correct geconfigureerd.';
      } else if (errorMessageString.includes('failed to fetch')) {
        errorText = 'Kan de backend server niet bereiken. Controleer uw netwerkverbinding en of de server online is.'
      }

       setScenarios(prevScenarios => prevScenarios.map(s => {
            if (s.id !== currentScenarioId) return s;
            return {
                ...s,
                chat: s.chat.map(msg => msg.id === placeholderMessageId ? {
                    ...msg,
                    content: `<p class="text-red-600">${errorText}</p>`,
                    rawContent: errorText,
                } : msg)
            };
        }));

    } finally {
      setLoading(false);
      resetImage();
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    }
  }, [userId, activeAgents, currentScenario, updateCurrentScenario, setScenarios, responseMode, userProfile, imageFile, resetImage, agentWebSearchConfig]);

  const handleSummarize = useCallback(async () => {
    if (!currentScenario || currentScenario.chat.length <= 1) return;

    logEvent('summary_requested', { userId, scenarioId: currentScenario.id });
    setIsSummarizing(true);
    const placeholderMessageId = `msg_${Date.now()}_ai_summary`;
    const loadingMessage: ChatMessage = { id: placeholderMessageId, role: 'ai', content: '__TYPING__', isSummary: true };
    
    updateCurrentScenario({ chat: [...currentScenario.chat, loadingMessage] });

    try {
      const summaryText = await getSummary(currentScenario.chat, activeAgents, userProfile);
      const htmlContent = typeof marked !== 'undefined' ? marked.parse(summaryText) : summaryText;

      logEvent('summary_received', { userId, scenarioId: currentScenario.id, hasError: false, summaryLength: summaryText.length });

      const finalMessage: ChatMessage = {
        id: placeholderMessageId,
        role: 'ai',
        content: htmlContent,
        rawContent: summaryText,
        isSummary: true,
      };
      updateCurrentScenario({ chat: currentScenario.chat.map(msg => msg.id === placeholderMessageId ? finalMessage : msg) });
    } catch (error) {
      console.error("Error handling summary:", error);
      const err = error as Error;
      logEvent('summary_received', { userId, scenarioId: currentScenario.id, hasError: true, error: err.message });
      const errorText = 'Sorry, er is iets misgegaan bij het genereren van de samenvatting.';
      const errorMessage: ChatMessage = {
        id: placeholderMessageId,
        role: 'ai',
        content: `<p class="text-red-600">${errorText}</p>`,
        rawContent: errorText,
        isSummary: true,
      };
      updateCurrentScenario({ chat: currentScenario.chat.map(msg => msg.id === placeholderMessageId ? errorMessage : msg) });
    } finally {
      setIsSummarizing(false);
    }
  }, [userId, currentScenario, activeAgents, updateCurrentScenario, userProfile]);

  return { handleSend, handleSummarize, loading, isSummarizing };
}