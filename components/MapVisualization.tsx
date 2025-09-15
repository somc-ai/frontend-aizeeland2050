import React, { useState, useCallback } from 'react';
import { MapComponent, MapState } from './MapComponent';
import { getCoordinates } from '../services/geocodingService';
import { MapPinIcon } from './icons/MapPinIcon';
import { SearchIcon } from './icons/SearchIcon';

const ZEELAND_CENTER = { lat: 51.492, lng: 3.846 };
const INITIAL_ZOOM = 9;
const LOCATION_ZOOM = 13;

export const MapVisualization: React.FC = () => {
    const [mapState, setMapState] = useState<MapState>({ center: ZEELAND_CENTER, zoom: INITIAL_ZOOM });
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMapAvailable, setIsMapAvailable] = useState(true);

    const handleMapLoadStateChange = useCallback((state: { loaded: boolean }) => {
        setIsMapAvailable(state.loaded);
        if (!state.loaded) {
            setError(null); // Clear search errors if map itself failed
        }
    }, []);

    const handleSearch = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        const location = inputValue.trim();
        if (!location || !isMapAvailable) return;

        setLoading(true);
        setError(null);
        try {
            const coords = await getCoordinates(location);
            if (coords) {
                setMapState({ center: coords, zoom: LOCATION_ZOOM });
            } else {
                setError(`Locatie "${location}" niet gevonden.`);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.';
            const lowerCaseMessage = message.toLowerCase();
            
            if (lowerCaseMessage.includes('api-sleutel') || lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('request_denied')) {
                setError('Zoeken mislukt: de Google Maps API-sleutel is ongeldig of ontbreekt.');
            } else {
                 setError(`Fout bij zoeken: ${message}`);
            }
            console.error('Geocoding search failed:', err);
        } finally {
            setLoading(false);
        }
    }, [inputValue, isMapAvailable]);

    return (
        <div>
            <h3 className="px-3 mb-2 text-sm font-semibold text-slate-600 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                Kaart
            </h3>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
                <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isMapAvailable ? "Zoek een locatie in Zeeland..." : "Kaart niet beschikbaar"}
                        className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        disabled={!isMapAvailable || loading}
                    />
                    <button
                        type="submit"
                        disabled={!isMapAvailable || loading || !inputValue.trim()}
                        className="flex-shrink-0 bg-indigo-600 text-white rounded-md p-2 hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        aria-label="Zoek locatie"
                    >
                        {loading ? 
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> :
                          <SearchIcon className="h-5 w-5" />
                        }
                    </button>
                </form>
                {error && <p className="text-red-600 text-xs mb-2 text-center">{error}</p>}
                <div className="h-64 w-full rounded-md overflow-hidden relative">
                     <MapComponent 
                        center={mapState.center} 
                        zoom={mapState.zoom} 
                        onLoadStateChange={handleMapLoadStateChange}
                    />
                </div>
            </div>
        </div>
    );
};
