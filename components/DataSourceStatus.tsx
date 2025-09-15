import React from 'react';

const StatusDot: React.FC<{ online: boolean }> = ({ online }) => {
    return <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'}`}></span>
}

export const DataSourceStatus: React.FC = () => {
    const sources = [
        { name: 'CBS OpenData', online: true },
        { name: 'Dataportaal Zeeland', online: true },
        { name: 'Zeeland.nl Archief', online: true },
        { name: 'Google Search API', online: true },
    ];
    return (
        <div>
            <h3 className="px-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Data Bronnen</h3>
            <ul className="space-y-2">
                {sources.map(source => (
                    <li key={source.name} className="flex items-center justify-between px-1 py-0.5 text-sm text-slate-700">
                        <span className="flex items-center">
                          <StatusDot online={source.online} />
                          <span className="ml-2.5">{source.name}</span>
                        </span>
                        <span className="font-medium text-green-600 text-xs">Online</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};