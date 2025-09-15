import React from 'react';
import { ScaleIcon } from './icons/ScaleIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

type Props = {
    onGoBack: () => void;
};

export const TermsAndConditionsPage: React.FC<Props> = ({ onGoBack }) => {
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
                                <p className="text-sm text-slate-500">Zeeland AI Platform - Gebruiksvoorwaarden</p>
                            </div>
                        </div>
                        <button
                            onClick={onGoBack}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 border border-transparent text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span>Terug</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                    <div className="prose prose-slate max-w-none">
                        <h2>Gebruiksvoorwaarden voor AIAgentsGov</h2>
                        <p>Laatst bijgewerkt: 24 augustus 2024</p>
                        
                        <p>Lees deze gebruiksvoorwaarden zorgvuldig door voordat u de AIAgentsGov-applicatie (de "Applicatie") gebruikt. Door de Applicatie te gebruiken, gaat u akkoord met deze voorwaarden.</p>
                        
                        <h3>Artikel 1: Acceptatie van de Voorwaarden</h3>
                        <p>Door toegang te zoeken tot en gebruik te maken van de Applicatie, verklaart u dat u bevoegd bent om deze tool te gebruiken in uw hoedanigheid als medewerker van de Provincie Zeeland. U stemt ermee in gebonden te zijn aan deze Gebruiksvoorwaarden.</p>

                        <h3>Artikel 2: Experimentele Status</h3>
                        <p>U erkent dat de Applicatie een <strong>experimentele tool</strong> is. De functionaliteiten en de onderliggende AI-modellen zijn in ontwikkeling. De Applicatie wordt "as is" aangeboden, zonder enige vorm van garantie, expliciet of impliciet.</p>

                        <h3>Artikel 3: Toegestaan Gebruik</h3>
                        <p>De Applicatie is bedoeld als hulpmiddel voor professioneel gebruik binnen de Provincie Zeeland. Het is uitdrukkelijk <strong>NIET TOEGESTAAN</strong> om:</p>
                        <ul>
                            <li><strong>Gegevens die herleidbaar zijn tot personen in te voeren:</strong> Voer geen informatie in die direct of indirect herleidbaar is tot een natuurlijk persoon (namen, adressen, BSN-nummers, etc.).</li>
                            <li><strong>Vertrouwelijke of politiek gevoelige informatie in te voeren:</strong> Voer geen staatsgeheimen, strategische beleidsstukken, of andere gevoelige bedrijfsinformatie in.</li>
                            <li>Data te gebruiken die inbreuk pleegt op enig intellectueel eigendomsrecht van derden.</li>
                            <li>De Applicatie te gebruiken voor onwettige doeleinden.</li>
                        </ul>
                        
                        <h3>Artikel 4: Disclaimer van Aansprakelijkheid</h3>
                        <p>De door de AI gegenereerde output kan onnauwkeurigheden, fouten of verouderde informatie bevatten. De Provincie Zeeland en de ontwikkelaar van de Applicatie, So-MC B.V., zijn niet aansprakelijk voor enige schade die voortvloeit uit het gebruik van de informatie die door de Applicatie wordt verstrekt. U bent zelf verantwoordelijk voor het verifiëren van de feitelijke juistheid en de geschiktheid van de output voor uw doeleinden.</p>
                        
                        <h3>Artikel 5: Gegevensopslag en -verwerking</h3>
                        <p>Uw scenario's en chatgeschiedenis worden uitsluitend <strong>lokaal in uw browser opgeslagen</strong> op uw eigen apparaat. Deze data verlaat uw computer niet voor opslagdoeleinden.</p>
                        <p><strong>Belangrijke Notitie over Verwerking:</strong> Om een antwoord te genereren, worden de door u ingevoerde vragen en de context van het gesprek (de 'prompt') verzonden naar de backend server en vervolgens naar de Google Gemini API. U erkent en gaat ermee akkoord dat deze verwerking van gegevens mogelijk plaatsvindt op servers buiten de Europese Economische Ruimte (EER).</p>

                        <h3>Artikel 6: Privacy en Analytics</h3>
                        <p>Om de Applicatie te verbeteren, worden anonieme gebruiksstatistieken verzameld (bijvoorbeeld welke AI-experts worden geselecteerd en hoe vaak de tool wordt gebruikt). Er worden geen persoonlijk identificeerbare gegevens verzameld en de inhoud van uw chats wordt niet gelogd voor analytische doeleinden.</p>
                        
                        <h3>Artikel 7: Wijziging en Beëindiging</h3>
                        <p>Wij behouden ons het recht voor om de Applicatie en deze gebruiksvoorwaarden op elk moment, zonder voorafgaande kennisgeving, te wijzigen of de dienstverlening te beëindigen.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};