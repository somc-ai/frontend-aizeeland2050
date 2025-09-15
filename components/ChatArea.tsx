import React from 'react';
import { Agent, ChatMessage } from '../types';
import { ChatWindow } from './ChatWindow';
import { EmptyChat } from './EmptyChat';

type Props = {
    chat: ChatMessage[];
    zoomLevel: number;
    onSelectSuggestion: (suggestion: string) => void;
    activeAgents: Agent[];
}

export const ChatArea = React.forwardRef<HTMLDivElement, Props>(({ chat, zoomLevel, onSelectSuggestion, activeAgents }, ref) => {
    return (
        <div ref={ref} className="flex-1 overflow-y-auto">
            {chat.length === 0 ? (
                <EmptyChat onSelectSuggestion={onSelectSuggestion} activeAgents={activeAgents} />
            ) : (
                <ChatWindow chat={chat} zoomLevel={zoomLevel} />
            )}
        </div>
    );
});