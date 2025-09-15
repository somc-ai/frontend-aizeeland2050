import React, { useState } from 'react';
import { ScaleIcon } from './icons/ScaleIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { PrivacyNotice } from './PrivacyNotice';

type Props = {
  onLoginSuccess: () => void;
  onShowTerms: () => void;
};

const APP_PASSWORD = 'zeeland2050';

export const PasswordScreen: React.FC<Props> = ({ onLoginSuccess, onShowTerms }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeConditions, setAgreeConditions] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const isButtonDisabled = !password || !agreeConditions || !isAuthorized || loading;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isButtonDisabled) return;
        setError('');
        setLoading(true);

        setTimeout(() => {
            if (password === APP_PASSWORD) {
                console.log(`[AUTH] Password correct. Unlocking application at ${new Date().toISOString()}`);
                onLoginSuccess();
            } else {
                console.warn(`[AUTH] Failed login attempt with password at ${new Date().toISOString()}`);
                setError('Incorrect wachtwoord. Probeer het opnieuw.');
                setPassword('');
            }
            setLoading(false);
        }, 300);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="text-center p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <ScaleIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">AIAgentGov</h1>
                        <p className="text-sm text-slate-500">Zeeland AI Platform</p>
                    </div>
                </div>
                <h2 className="text-lg font-semibold text-slate-700 mb-2">Beveiligde Toegang</h2>
                <p className="text-slate-600 mb-6">
                    Voer het wachtwoord in en bevestig de voorwaarden om door te gaan.
                </p>
                <form onSubmit={handleSubmit} className="text-left">
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                           <LockClosedIcon className="h-5 w-5 text-slate-400" />
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="Wachtwoord"
                            disabled={loading}
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
                    
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
                               Ik ga akkoord met de <button type="button" onClick={onShowTerms} className="text-indigo-600 hover:underline font-semibold">gebruiksvoorwaarden</button> en begrijp dat dit een experimentele tool is. Ik zal geen persoonsgegevens of vertrouwelijke informatie invoeren.
                            </span>
                        </label>
                    </div>
                    
                    <PrivacyNotice />

                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                        className="w-full mt-4 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifiëren...' : 'Toegang krijgen'}
                    </button>
                </form>
            </div>
        </div>
    );
};