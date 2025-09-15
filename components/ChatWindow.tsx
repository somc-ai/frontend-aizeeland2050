import React from 'react';
import { ChatMessage } from '../types';
import { TypingIndicator } from './TypingIndicator';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { PencilIcon } from './icons/PencilIcon';

const SourceIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);

const AiMessage: React.FC<{ msg: ChatMessage, zoomClass: string }> = ({ msg, zoomClass }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (!msg.rawContent) return;
        navigator.clipboard.writeText(msg.rawContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => console.error("Failed to copy text: ", err));
    };

    if (msg.content === '__TYPING__') {
        return (
          <div className="p-4">
            <TypingIndicator />
          </div>
        );
    }

    return (
        <div className="relative group text-slate-800">
            <div className={`prose max-w-none prose-p:my-2 prose-headings:my-3 ${zoomClass}`} dangerouslySetInnerHTML={{ __html: msg.content }} />
            {msg.rawContent && (
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Kopieer tekst"
                >
                    {copied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
}

const SummaryMessage: React.FC<{ msg: ChatMessage, zoomClass: string }> = ({ msg, zoomClass }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (!msg.rawContent) return;
        navigator.clipboard.writeText(msg.rawContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => console.error("Failed to copy text: ", err));
    };

    return (
        <div className="relative group">
            {msg.content === '__TYPING__' ? (
                 <div className="flex flex-col items-center justify-center p-4">
                    <TypingIndicator />
                    <span className="text-sm text-amber-700 mt-2">Samenvatting wordt gemaakt...</span>
                 </div>
            ) : (
                <>
                    <div className="flex items-center text-amber-800 mb-3">
                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                        <h3 className="font-bold text-base">Samenvatting</h3>
                    </div>
                    <div className={`prose max-w-none prose-p:my-2 prose-headings:my-3 text-slate-800 ${zoomClass}`} dangerouslySetInnerHTML={{ __html: msg.content }} />
                    {msg.rawContent && (
                        <button
                            onClick={handleCopy}
                            className="absolute top-0 right-0 p-1.5 bg-amber-100 border border-amber-200 rounded-full text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-200 hover:text-amber-900"
                            aria-label="Kopieer samenvatting"
                        >
                            {copied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const getProseZoomClass = (level: number): string => {
    switch (level) {
        case -2: case -1: return 'prose-sm';
        case 1: return 'prose-lg';
        case 2: return 'prose-xl';
        default: return 'prose-base';
    }
};

const getTextZoomClass = (level: number): string => {
    switch (level) {
        case -2: return 'text-xs';
        case -1: return 'text-sm';
        case 1: return 'text-lg';
        case 2: return 'text-xl';
        default: return 'text-base';
    }
};

export const ChatWindow = React.memo(({ chat, zoomLevel }: { chat: ChatMessage[], zoomLevel: number }) => {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const proseZoomClass = getProseZoomClass(zoomLevel);
  const textZoomClass = getTextZoomClass(zoomLevel);
  const isTyping = chat.length > 0 && chat[chat.length - 1].content === '__TYPING__';

  React.useEffect(() => {
    if (chatContainerRef.current) {
        const isScrolledToBottom = chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight <= chatContainerRef.current.scrollTop + 50;
        if(isScrolledToBottom || isTyping){
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }
  }, [chat, isTyping]);

  return (
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col">
        {chat.map(msg => {
            if (msg.role === 'system') {
                return (
                    <div key={msg.id} className="flex justify-center items-center my-4 text-slate-500">
                         <PencilIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                         <span className="text-xs font-medium">{msg.content}</span>
                    </div>
                );
            }
            return (
                <div key={msg.id} className={`flex flex-col max-w-3xl mb-6 ${msg.role === 'user' ? 'self-end' : 'self-start w-full'}`}>
                   <div className={`shadow-sm ${
                        msg.isSummary 
                            ? 'bg-amber-50 text-slate-900 rounded-lg border border-amber-200 w-full p-4'
                            : msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none px-4 py-3 max-w-2xl' 
                                : 'bg-white text-slate-900 rounded-2xl rounded-bl-none border border-slate-200 w-full p-4'
                    }`}>
                      {msg.role === 'ai' ? (
                          msg.isSummary ? <SummaryMessage msg={msg} zoomClass={proseZoomClass} /> : <AiMessage msg={msg} zoomClass={proseZoomClass} />
                      ) : (
                        <>
                            {msg.imageUrl && <img src={msg.imageUrl} alt="Bijlage" className="mb-2 rounded-lg max-w-full max-h-64 object-contain" />}
                            <div className={`prose prose-invert max-w-none prose-p:my-2 prose-strong:text-white ${proseZoomClass}`} dangerouslySetInnerHTML={{ __html: msg.content }} />
                        </>
                      )}
                  </div>
                  {msg.sources && msg.sources.length > 0 && !msg.isSummary && (
                    <div className={`mt-3 text-slate-500 w-full max-w-full ${textZoomClass}`}>
                      <h4 className="font-semibold mb-2 text-slate-600 flex items-center">
                          <SourceIcon className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Bronnen</span>
                      </h4>
                      <ol className="space-y-2.5">
                        {msg.sources.map((src, i) => (
                          <li key={i} id={`source-${i + 1}`} className="flex items-start group scroll-mt-20">
                              <span className="flex-shrink-0 mr-3 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold">{i + 1}</span>
                              <div className="flex-1">
                                <p className="font-medium text-slate-800 leading-tight">{src.label}</p>
                                <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs break-all" title={src.url}>{src.url}</a>
                              </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
            );
        })}
      </div>
    </div>
  );
});