import React from 'react';
import { Agent } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { SparklesIcon } from './icons/SparklesIcon';

type Props = {
  agents: Agent[];
  selected: string[];
  onToggle: (id: string) => void;
};

const AgentIcon: React.FC<{ type: Agent['type'], isSelected: boolean }> = ({ type, isSelected }) => {
  const iconClass = `w-4 h-4 mr-2 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`;
  if (type === 'creative') {
    return <SparklesIcon className={iconClass} />;
  }
  return <SearchIcon className={iconClass} />;
};

export const AgentSelector = React.memo(({ agents, selected, onToggle }: Props) => {
  return (
    <div>
      <h2 className="text-slate-900 font-bold text-lg mb-2">Actieve Experts</h2>
      <div className="flex flex-col gap-2">
        {agents.map(agent => {
           const isSelected = selected.includes(agent.id);
           const stateClasses = isSelected 
             ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200' 
             : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400';

          return (
            <button
              key={agent.id}
              onClick={() => onToggle(agent.id)}
              className={`flex flex-col items-start text-left p-3 rounded-lg border transition-all duration-200 ${stateClasses}`}
            >
              <span className={`font-semibold flex items-center ${isSelected ? 'text-indigo-800' : 'text-slate-800'}`}>
                <AgentIcon type={agent.type} isSelected={isSelected} />
                {agent.name}
              </span>
              <span className="text-slate-600 text-sm mt-1">{agent.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
});