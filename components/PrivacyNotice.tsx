import React from 'react';

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const PrivacyNotice: React.FC = () => {
    return (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-slate-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="text-sm font-semibold text-slate-800">Privacy & Dataopslag</h4>
                    <p className="text-xs text-slate-600 mt-1">
                        Uw scenario's en chatgeschiedenis worden uitsluitend lokaal in uw browser opgeslagen. Om de applicatie te verbeteren, verzamelen we anonieme gebruiksstatistieken. Er worden geen persoonlijk identificeerbare gegevens verzameld of opgeslagen.
                    </p>
                </div>
            </div>
        </div>
    );
};