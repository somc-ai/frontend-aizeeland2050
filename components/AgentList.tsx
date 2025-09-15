import React from 'react';
import { Agent } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

type Props = {
  agents: Agent[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  agentWebSearchConfig: Record<string, boolean>;
  onToggleWebSearch: (id: string, isEnabled: boolean) => void;
};

export const AgentList = React.memo(({ agents, selectedIds, onToggle }: Props) => {
  return (
    <div className="space-y-2">
      {agents.map(agent => {
        const isSelected = selectedIds.includes(agent.id);
        const stateClasses = isSelected
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 border-slate-200 border';

        return (
          <button
            key={agent.id}
            onClick={() => onToggle(agent.id)}
            className={`flex flex-col items-start w-full text-left p-3 rounded-lg transition-all duration-200 ${stateClasses}`}
          >
            <div className="flex items-start w-full">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${isSelected ? 'bg-white/20' : 'bg-indigo-50'}`}>
                <agent.icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
              </div>
              <div className="flex-1">
                <span className={`font-semibold block text-sm ${isSelected ? 'text-white' : 'text-slate-800'}`}>{agent.name}</span>
                <span className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>{agent.description}</span>
              </div>
              <div className="ml-3 self-center">
                  {isSelected && <CheckCircleIcon className="w-6 h-6 text-green-400" />}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  );
});