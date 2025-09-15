import React from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { LightningBoltIcon } from './icons/LightningBoltIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ResponseMode } from '../types';

type Props = {
  mode: ResponseMode;
  onSetMode: (mode: ResponseMode) => void;
};

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

const commonButtonClasses = 'px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 relative flex items-center gap-1.5';

export const ResponseModeToggle: React.FC<Props> = ({ mode, onSetMode }) => {
  return (
    <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg">
            <button
                onClick={() => onSetMode('verified')}
                className={`${commonButtonClasses} ${mode === 'verified' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'bg-transparent text-slate-600 hover:bg-white/50'}`}
            >
                <SearchIcon className="w-4 h-4" />
                Geverifieerd
            </button>
             <button
                onClick={() => onSetMode('deep_research')}
                className={`${commonButtonClasses} ${mode === 'deep_research' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'bg-transparent text-slate-600 hover:bg-white/50'}`}
            >
                <BookOpenIcon className="w-4 h-4" />
                Diepgaand
            </button>
            <button
                onClick={() => onSetMode('direct')}
                className={`${commonButtonClasses} ${mode === 'direct' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'bg-transparent text-slate-600 hover:bg-white/50'}`}
            >
                <LightningBoltIcon className="w-4 h-4" />
                Direct
            </button>
        </div>
        <div className="relative group flex items-center">
            <InformationCircleIcon className="w-5 h-5 text-slate-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-3 bg-slate-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <h4 className="font-bold mb-1">Uitleg Antwoordmodi</h4>
                <p className="text-xs mb-2"><strong>Geverifieerd:</strong> Gebruikt Google Search voor actuele, feitelijke antwoorden met bronvermelding. Aanbevolen voor de meeste vragen.</p>
                <p className="text-xs mb-2"><strong>Diepgaand:</strong> Voert een uitgebreide analyse uit en genereert een gestructureerd rapport. Ideaal voor complexe onderzoeksvragen, kan langer duren.</p>
                <p className="text-xs"><strong>Direct:</strong> Genereert snel een antwoord op basis van bestaande kennis, zonder zoekopdrachten. Geschikt voor brainstormen of creatieve input.</p>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-slate-800 transform rotate-45"></div>
            </div>
        </div>
    </div>
  );
};