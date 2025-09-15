
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ScaleIcon } from './icons/ScaleIcon';
import { PrivacyNotice } from './PrivacyNotice';

export const LoginScreen: React.FC = () => {
    const { signIn } = useAuth();
    const [agreeConditions, setAgreeConditions] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);

    const isButtonDisabled = !agreeConditions || !isAuthorized || loading;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isButtonDisabled) return;

        setLoading(true);
        console.log(`[AUTH] Gebruiker logt anoniem in op ${new Date().toISOString()}`);
        // Simuleer een netwerkverzoek voor betere UX
        setTimeout(() => {
            signIn();
        }, 300);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center p-8 bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <ScaleIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">AIAgentGov</h1>
                            <p className="text-sm text-slate-500">Zeeland AI Platform</p>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Welkom</h2>
                    <p className="text-slate-600 mb-8">
                        Bevestig de voorwaarden om toegang te krijgen tot de applicatie.
                    </p>
                    <form onSubmit={handleSubmit} className="text-left space-y-4">
                        <div className="space-y-3">
                             <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAuthorized}
                                    onChange={(e) => setIsAuthorized(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                                />
                                <span className="ml-2 text-sm text-slate-600">
                                    Ik ben bevoegd om hier gebruik van te maken en ben werkzaam bij de Provincie Zeeland.
                                </span>
                            </label>
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreeConditions}
                                    onChange={(e) => setAgreeConditions(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                                />
                                <span className="ml-2 text-sm text-slate-600">
                                   Ik ga akkoord met de gebruiksvoorwaarden en begrijp dat dit een experimentele tool is. Ik zal geen persoonsgegevens of vertrouwelijke informatie invoeren.
                                </span>
                            </label>
                        </div>
                        
                        <PrivacyNotice />

                        <button
                            type="submit"
                            disabled={isButtonDisabled}
                            className="w-full mt-4 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Laden...' : 'Toegang krijgen'}
                        </button>
                    </form>
                </div>
                <div className="text-center mt-6">
                    <a 
                        href="https://www.somc.ai" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        Powered by SoMC.AI
                    </a>
                </div>
            </div>
        </div>
    );
};
