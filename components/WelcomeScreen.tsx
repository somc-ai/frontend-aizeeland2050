import React from 'react';
import { Agent } from '../types';

type Props = {
  agents: Pick<Agent, 'name' | 'exampleQuestions'>[];
  onExample: (question: string) => void;
};

export const WelcomeScreen = React.memo(({ agents, onExample }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Welkom bij Zeeland 2050</h1>
        <p className="text-slate-600 mb-8 text-lg">Kies links een of meer experts, selecteer een antwoordmodus en stel uw vraag.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {agents.map(agent => (
            <div key={agent.name} className="bg-white/80 rounded-lg p-4 shadow-sm border border-slate-200">
              <h3 className="font-semibold mb-3 text-slate-800">{agent.name}</h3>
              <div className="flex flex-wrap gap-2">
                {agent.exampleQuestions.map(q => (
                  <button 
                    key={q} 
                    className="text-sm text-left text-slate-700 hover:text-indigo-800 hover:bg-indigo-100 bg-slate-100 rounded-full px-3 py-1 transition-colors duration-150" 
                    onClick={() => onExample(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});