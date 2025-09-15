import React from 'react';
import { ScaleIcon } from './icons/ScaleIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

type Props = {
    onGoBack: () => void;
};

export const FaqPage: React.FC<Props> = ({ onGoBack }) => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <ScaleIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">AIAgentGov</h1>
                                <p className="text-sm text-slate-500">Zeeland AI Platform - FAQ</p>
                            </div>
                        </div>
                        <button
                            onClick={onGoBack}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 border border-transparent text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span>Terug naar de applicatie</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                    <div className="prose prose-slate max-w-none">
                        <h2 id="faq">Veelgestelde Vragen (FAQ)</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3>Wat is het doel van deze applicatie?</h3>
                                <p>Het doel is om een laagdrempelige manier te bieden om de mogelijkheden van Generatieve AI te verkennen binnen de context van de Provincie Zeeland. Het is een hulpmiddel voor het verkennen van toekomstscenario's, het analyseren van beleidsvragen en het ondersteunen van creatieve processen.</p>
                            </div>
                            <div>
                                <h3>Hoe werkt de applicatie?</h3>
                                <p>U selecteert links één of meerdere AI-experts. Vervolgens kiest u een antwoordmodus ('Geverifieerd' voor actuele antwoorden met bronnen, 'Diepgaand' voor rapporten, of 'Direct' voor snelle, creatieve input) en stelt u uw vraag. De geselecteerde experts combineren hun perspectieven om één geïntegreerd antwoord te geven.</p>
                            </div>
                             <div>
                                <h3>Hoe werkt het achter de schermen? (Uitlegbaarheid)</h3>
                                <p>Nadat u een vraag stelt, wordt deze samen met de context (geselecteerde experts, rol, chatgeschiedenis) naar de backend gestuurd. De backend stelt een gedetailleerde instructie ('prompt') op voor het Google Gemini AI-model. Het model analyseert deze input en genereert een antwoord, dat vervolgens wordt teruggestuurd en weergegeven in de chat. Dit proces zorgt ervoor dat de output is afgestemd op de geselecteerde expertisegebieden.</p>
                            </div>
                            <div>
                                <h3>Waar komt de informatie vandaan?</h3>
                                <p>De antwoorden worden gegenereerd door Google's Gemini-model. Afhankelijk van de gekozen modus, baseert de AI zijn antwoord op zijn algemene kennis ('Direct') of op actuele informatie van het internet via Google Search ('Geverifieerd' en 'Diepgaand'). Sommige experts hebben ook toegang tot specifieke openbare beleidsdocumenten als context.</p>
                            </div>
                            <div>
                                <h3>Zijn mijn gesprekken privé?</h3>
                                <p><strong>Ja.</strong> Uw scenario's en chatgeschiedenis worden uitsluitend lokaal in uw eigen browser opgeslagen. Er worden geen gespreksgegevens naar een centrale server gestuurd voor opslag. Om de tool te verbeteren, worden anonieme gebruiksstatistieken verzameld (bijv. welke experts worden gebruikt), maar de inhoud van uw vragen en antwoorden wordt niet gelogd.</p>
                            </div>
                            <div>
                                <h3>Kan ik de antwoorden volledig vertrouwen?</h3>
                                <p>Nee, niet zonder verificatie. Dit is een <strong>experimentele tool</strong>. Hoewel de AI is ontworpen om nuttige en feitelijke informatie te geven, kan het fouten maken. Gebruik de antwoorden als startpunt voor uw onderzoek en verifieer belangrijke informatie altijd via de meegeleverde bronnen of andere betrouwbare kanalen.</p>
                            </div>
                             <div>
                                <h3>Kan ik mijn werk opslaan en later terugkomen?</h3>
                                <p>Ja. De applicatie werkt met "Scenario's". Elk scenario is een apart gesprek. U kunt meerdere scenario's aanmaken en ertussen wisselen. Zolang u dezelfde browser op hetzelfde apparaat gebruikt, blijft uw werk bewaard voor een volgende sessie.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
