import React from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { MagnifyingGlassPlusIcon } from './icons/MagnifyingGlassPlusIcon';
import { MagnifyingGlassMinusIcon } from './icons/MagnifyingGlassMinusIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { UserProfile } from '../types';
import { UserMenu } from './UserMenu';
import { StatusIndicator } from './StatusIndicator';

type Props = {
    scenarioTitle: string;
    chatLength: number;
    canSummarize: boolean;
    onSummarize: () => void;
    zoomLevel: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    userProfile: UserProfile;
    onSetProfile: (profile: UserProfile) => void;
    onDownloadPdf: () => void;
    isDownloadingPdf: boolean;
    onShowFaq: () => void;
    isBackendOnline: boolean;
}

const MIN_ZOOM = -2;
const MAX_ZOOM = 2;

export const MainHeader: React.FC<Props> = (props) => {
    const downloadDisabled = props.chatLength === 0 || props.isDownloadingPdf;
    return (
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white/60 backdrop-blur-sm z-10 flex-shrink-0">
           <div className="flex items-center gap-3">
             <h2 className="text-lg font-bold text-slate-800 truncate" title={props.scenarioTitle}>{props.scenarioTitle}</h2>
             <StatusIndicator online={props.isBackendOnline} />
           </div>
          <div className="flex items-center gap-4">
             {props.chatLength > 0 && (
                 <>
                    <button
                        onClick={props.onSummarize}
                        disabled={!props.canSummarize}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <DocumentTextIcon className="w-5 h-5" />
                        <span>Samenvatten</span>
                    </button>
                    <button
                        onClick={props.onDownloadPdf}
                        disabled={downloadDisabled}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {props.isDownloadingPdf ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <ArrowDownTrayIcon className="w-5 h-5" />
                        )}
                        <span>{props.isDownloadingPdf ? 'Genereren...' : 'Download PDF'}</span>
                    </button>
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg">
                        <button 
                            onClick={props.onZoomOut} 
                            disabled={props.zoomLevel <= MIN_ZOOM}
                            className="p-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
                            aria-label="Tekst verkleinen"
                        >
                            <MagnifyingGlassMinusIcon className="w-5 h-5" />
                        </button>
                        <div className="w-px h-5 bg-slate-300"></div>
                        <button 
                            onClick={props.onZoomIn} 
                            disabled={props.zoomLevel >= MAX_ZOOM}
                            className="p-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
                            aria-label="Tekst vergroten"
                        >
                             <MagnifyingGlassPlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                 </>
             )}
            <button
                onClick={props.onShowFaq}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Veelgestelde Vragen"
            >
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">FAQ</span>
            </button>
             <UserMenu
                profile={props.userProfile}
                onSetProfile={props.onSetProfile}
            />
          </div>
        </header>
    );
};