import React from 'react';

type Props = {
  suggestions: string[];
  onSelect: (question: string) => void;
};

export const SuggestionButtons: React.FC<Props> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {suggestions.map(q => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="bg-white border border-slate-200 text-slate-700 text-left rounded-lg p-4 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <span className="font-semibold text-slate-800">{q}</span>
        </button>
      ))}
    </div>
  );
};