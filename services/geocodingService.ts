if (!process.env.API_KEY) {
    // We log a warning instead of throwing an error, so the app can run without map functionality.
    console.warn("API_KEY environment variable not set. Map functionality will be disabled.");
}

type GeocodeResult = {
    results: {
        geometry: {
            location: {
                lat: number;
                lng: number;
            }
        }
    }[];
    status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
    error_message?: string;
}

/**
 * Gets coordinates for a given location name using Google's Geocoding API.
 * @param locationName The name of the location (e.g., "Middelburg" or "Zeeland, Nederland").
 * @returns A promise that resolves with the coordinates { lat, lng } or null if not found.
 * @throws An error if the API key is missing, or if the API request fails for reasons other than 'ZERO_RESULTS'.
 */
export async function getCoordinates(locationName: string): Promise<{ lat: number; lng: number } | null> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("De Google Maps API-sleutel is niet ingesteld. Zoeken is uitgeschakeld.");
    }

    const encodedLocation = encodeURIComponent(`${locationName}, Zeeland, Nederland`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data: GeocodeResult = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            return data.results[0].geometry.location;
        }
        
        if (data.status === 'ZERO_RESULTS') {
            return null;
        }
        
        // Any other status is an error.
        const errorMessage = data.error_message || `De Geocoding API gaf status: ${data.status}`;
        console.error(`Geocoding API error for "${locationName}": ${errorMessage}`);
        throw new Error(errorMessage);

    } catch (error) {
        console.error('Error during geocoding fetch:', error);
        if (error instanceof TypeError) { // Often indicates a network error
            throw new Error("Netwerkfout bij het verbinden met de Geocoding API.");
        }
        throw error; // Re-throw to be handled by the UI layer.
    }
}