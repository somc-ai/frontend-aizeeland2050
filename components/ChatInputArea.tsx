import React from 'react';
import { PromptInput } from './PromptInput';
import { ResponseModeToggle } from './ResponseModeToggle';
import { ResponseMode } from '../types';

type Props = {
    responseMode: ResponseMode;
    onSetResponseMode: (mode: ResponseMode) => void;
    onSend: (text: string) => void;
    loading: boolean;
    inputValue: string;
    onInputChange: (value: string) => void;
    onImageSelect: (file: File) => void;
    onRemoveImage: () => void;
    imagePreviewUrl: string | null;
}

export const ChatInputArea: React.FC<Props> = (props) => {
    return (
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-center mb-3">
                    <ResponseModeToggle mode={props.responseMode} onSetMode={props.onSetResponseMode} />
                </div>
                <PromptInput 
                    onSend={props.onSend} 
                    loading={props.loading}
                    value={props.inputValue}
                    onChange={props.onInputChange}
                    onImageSelect={props.onImageSelect}
                    onRemoveImage={props.onRemoveImage}
                    imagePreviewUrl={props.imagePreviewUrl}
                />
                <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-md text-center mt-3 p-2">
                    <strong>Let op:</strong> AI kan fouten maken. Verifieer belangrijke informatie en voer geen persoonlijke of vertrouwelijke gegevens in.
                </p>
            </div>
        </div>
    );
};