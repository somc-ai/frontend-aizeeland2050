
import React from 'react';

type Props = {
  online: boolean;
};

export function StatusIndicator({ online }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full relative flex items-center justify-center ${online ? 'bg-green-500' : 'bg-red-500'}`}>
         {online && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
      </span>
      <span className={`text-xs font-semibold ${online ? 'text-green-700' : 'text-red-700'}`}>
        {online ? 'Verbonden' : 'Verbinding verbroken'}
      </span>
    </div>
  );
}
