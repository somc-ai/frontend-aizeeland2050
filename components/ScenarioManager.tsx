import React, { useState, useEffect, useRef } from 'react';
import { Scenario } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';

type ItemProps = {
  scenario: Scenario;
  isCurrent: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

const ScenarioItem: React.FC<ItemProps> = ({ scenario, isCurrent, onSelect, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(scenario.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(scenario.title);
  }, [scenario.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle && trimmedTitle !== scenario.title) {
      onRename(scenario.id, trimmedTitle);
    } else {
      setTitle(scenario.title);
    }
    setIsEditing(false);
  };

  return (
    <li
      className={`flex items-center group rounded-md cursor-pointer transition-colors ${isCurrent ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-slate-100 text-slate-700'}`}
      onClick={() => onSelect(scenario.id)}
    >
      <div className="flex-1 px-3 py-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="w-full bg-white border border-indigo-300 rounded px-1 py-0 text-sm"
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="font-semibold text-sm">{scenario.title}</span>
        )}
      </div>
      <div className="flex items-center pr-2">
        <button
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-700 rounded-md"
          aria-label="Rename scenario"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(scenario.id); }}
          className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 rounded-md"
          aria-label="Delete scenario"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};


type Props = {
  scenarios: Scenario[];
  currentId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

export const ScenarioManager = React.memo(({ scenarios, currentId, onSelect, onAdd, onDelete, onRename }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-3">
        <h3 className="text-sm font-semibold text-slate-600">Mijn Scenario's</h3>
        <button onClick={onAdd} className="bg-indigo-600 text-white rounded-md p-1 hover:bg-indigo-700 transition-colors" aria-label="Nieuw scenario">
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <ul className="space-y-1">
        {scenarios.map(s => (
          <ScenarioItem
            key={s.id}
            scenario={s}
            isCurrent={s.id === currentId}
            onSelect={onSelect}
            onDelete={onDelete}
            onRename={onRename}
          />
        ))}
      </ul>
    </div>
  );
});