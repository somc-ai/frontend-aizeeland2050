// !! BELANGRIJKE INSTRUCTIES !!
// Om de logs in te zien, moet u dit script koppelen aan een Google Sheet.
// 1. Maak een nieuwe Google Sheet aan via https://sheets.new
// 2. Ga naar Extensies > Apps Script.
// 3. Plak de inhoud van het bestand `Code.gs` in de editor en sla op.
// 4. Klik op "Implementeren" > "Nieuwe implementatie".
// 5. Selecteer type "Web-app".
// 6. Bij "Wie heeft toegang", selecteer "Iedereen".
// 7. Klik op "Implementeren" en geef de vereiste toestemmingen (kies "Geavanceerd" bij de waarschuwing).
// 8. Kopieer de "Web-app-URL" die u krijgt.
// 9. Plak die URL hieronder en vervang de placeholder-tekst.

const LOG_ENDPOINT = 'VERVANG_DOOR_UW_GOOGLE_APPS_SCRIPT_URL';

/**
 * Logs an analytics event to the backend.
 * This is a "fire and forget" operation. It should not block the main thread
 * or throw errors that would interrupt the user experience.
 *
 * @param eventName A clear, descriptive name for the event (e.g., 'prompt_sent').
 * @param payload An object containing relevant data for the event.
 */
export function logEvent(eventName: string, payload: Record<string, any>): void {
  if (LOG_ENDPOINT === 'VERVANG_DOOR_UW_GOOGLE_APPS_SCRIPT_URL') {
      return;
  }
  
  try {
    const data = {
      eventName,
      ...payload,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    const body = JSON.stringify(data);
    
    fetch(LOG_ENDPOINT, {
      method: 'POST',
      body: body,
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
    });

  } catch (error) {
    console.error('Analytics logging failed:', error);
  }
}