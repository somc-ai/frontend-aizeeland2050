import React, { useRef, useEffect } from 'react';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { XCircleIcon } from './icons/XCircleIcon';

type Props = {
  onSend: (text: string) => void;
  loading: boolean;
  value: string;
  onChange: (text: string) => void;
  onImageSelect: (file: File) => void;
  onRemoveImage: () => void;
  imagePreviewUrl: string | null;
};

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

export const PromptInput = React.memo(({ onSend, loading, value, onChange, onImageSelect, onRemoveImage, imagePreviewUrl }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if ((value.trim() || imagePreviewUrl) && !loading) {
      onSend(value.trim());
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          onImageSelect(e.target.files[0]);
      }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col"
    >
      {imagePreviewUrl && (
          <div className="relative self-start mb-2">
              <img src={imagePreviewUrl} alt="Preview" className="max-h-24 max-w-full rounded-lg object-contain border border-slate-300" />
              <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5 hover:bg-slate-900 transition-colors"
                  aria-label="Verwijder afbeelding"
              >
                  <XCircleIcon className="w-5 h-5" />
              </button>
          </div>
      )}
      <div className="relative w-full group">
        <div className="flex items-end w-full bg-white rounded-2xl border border-slate-200 p-1.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg disabled:opacity-50"
                aria-label="Voeg afbeelding toe"
            >
                <PaperClipIcon className="w-6 h-6" />
            </button>
            <textarea
                ref={textareaRef}
                className="w-full bg-transparent pl-2 pr-2 py-2 text-slate-800 outline-none border-0 resize-none leading-6 disabled:bg-slate-50 disabled:cursor-not-allowed"
                placeholder="Stel je vraag aan de experts..."
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={loading}
                rows={1}
                style={{ maxHeight: '200px', overflowY: 'auto' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />
            <button
                type="submit"
                className="bg-slate-200 text-slate-500 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 hover:bg-slate-300 hover:text-slate-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                disabled={loading || (!value.trim() && !imagePreviewUrl)}
                aria-label="Verstuur"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <SendIcon className="h-5 w-5" />
                )}
            </button>
        </div>
      </div>
    </form>
  );
});