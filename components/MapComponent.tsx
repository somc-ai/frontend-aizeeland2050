import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Minimal Google Maps type definitions to satisfy TypeScript without @types/google.maps
declare global {
    namespace google.maps {
        interface LatLngLiteral {
            lat: number;
            lng: number;
        }

        interface MapTypeStyle {
            elementType?: string;
            featureType?: string;
            stylers: object[];
        }

        interface MapOptions {
            center?: LatLngLiteral;
            zoom?: number;
            disableDefaultUI?: boolean;
            zoomControl?: boolean;
            styles?: MapTypeStyle[];
        }

        class Map {
            constructor(mapDiv: HTMLElement, opts?: MapOptions);
            panTo(latLng: LatLngLiteral): void;
            setZoom(zoom: number): void;
        }

        interface MarkerOptions {
            position?: LatLngLiteral;
            map?: Map;
        }

        class Marker {
            constructor(opts?: MarkerOptions);
            setPosition(position: LatLngLiteral): void;
        }
    }
    interface Window {
        google: typeof google;
    }
}


export type MapState = {
  center: { lat: number; lng: number };
  zoom: number;
};

type Props = MapState & {
    onLoadStateChange?: (state: { loaded: boolean }) => void;
};

const mapStyles: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
    { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d9e9' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
];


export const MapComponent: React.FC<Props> = ({ center, zoom, onLoadStateChange }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const map = useRef<google.maps.Map | null>(null);
    const marker = useRef<google.maps.Marker | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [apiKey] = useState(process.env.API_KEY);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Effect 1: Load the Google Maps API. Runs once.
    useEffect(() => {
        if (!apiKey) {
            console.warn("API key is missing. Map will not be loaded.");
            setLoadError("De Google Maps API-sleutel ontbreekt.");
            onLoadStateChange?.({ loaded: false });
            return;
        }
        const loader = new Loader({ apiKey, version: 'weekly' });
        loader.load().then(() => {
            setIsLoaded(true);
            onLoadStateChange?.({ loaded: true });
        }).catch(e => {
            console.error("Failed to load Google Maps. The API key is likely invalid.", e);
            setLoadError("Kaart kon niet worden geladen. De API-sleutel is ongeldig.");
            onLoadStateChange?.({ loaded: false });
        });
    }, [apiKey, onLoadStateChange]);

    // Effect 2: Manage map instance. Runs when API is loaded or props change.
    useEffect(() => {
        if (isLoaded && mapRef.current && !loadError) {
            // Initialize map and marker if they don't exist
            if (!map.current) {
                map.current = new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: mapStyles,
                });
                marker.current = new window.google.maps.Marker({
                    map: map.current,
                    position: center,
                });
            } else {
                // Update existing map if props change
                map.current.panTo(center);
                map.current.setZoom(zoom);
                if (marker.current) {
                    marker.current.setPosition(center);
                }
            }
        }
    }, [isLoaded, center, zoom, loadError]);

    if (loadError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-center p-4">
                <p className="text-slate-600 text-sm">
                    Kaartfunctionaliteit is niet beschikbaar.
                    <span className="block text-xs mt-1 font-semibold text-red-700">
                        {loadError}
                    </span>
                </p>
            </div>
        );
    }
    
    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
                <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <div ref={mapRef} className="w-full h-full" />;
};
