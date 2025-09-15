import React, { useMemo } from 'react';
import { Agent } from '../types';
import { SuggestionButtons } from './SuggestionButtons';

type Props = {
    onSelectSuggestion: (suggestion: string) => void;
    activeAgents: Agent[];
}

function getShuffledSample<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export const EmptyChat: React.FC<Props> = ({ onSelectSuggestion, activeAgents }) => {
    const suggestions = useMemo(() => {
        if (!activeAgents || activeAgents.length === 0) return [];
        const allQuestions = activeAgents.flatMap(agent => agent.exampleQuestions);
        const uniqueQuestions = [...new Set(allQuestions)];
        return getShuffledSample(uniqueQuestions, 4);
    }, [activeAgents]);
    
    const hasActiveAgents = activeAgents.length > 0;

    return (
        <div className="flex flex-col h-full items-center justify-center p-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Start een nieuw gesprek</h2>
                <p className="text-slate-500 mt-1 max-w-xl">
                    {hasActiveAgents 
                        ? 'Stel een vraag aan de geselecteerde experts of begin met een van de onderstaande suggesties.'
                        : 'Selecteer links een expert om te beginnen en suggesties te zien.'
                    }
                </p>
            </div>
            {hasActiveAgents && suggestions.length > 0 && (
                <div className="mt-8 w-full">
                    <SuggestionButtons suggestions={suggestions} onSelect={onSelectSuggestion} />
                </div>
            )}
        </div>
    );
};