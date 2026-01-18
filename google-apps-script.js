/**
 * Google Apps Script per Iscrizioni PSF 2026
 *
 * ISTRUZIONI DI SETUP:
 * 1. Vai su https://script.google.com e crea un nuovo progetto
 * 2. Copia tutto questo codice nel file Code.gs
 * 3. Crea un Google Sheet con le colonne indicate sotto
 * 4. Copia l'ID del Google Sheet (dalla URL) e incollalo qui sotto
 * 5. Clicca su "Deploy" > "New deployment" > "Web app"
 * 6. Imposta "Execute as: Me" e "Who has access: Anyone"
 * 7. Copia l'URL del deployment e incollalo nel file script.js del sito
 */

// ⚠️ IMPORTANTE: Sostituisci con l'ID del tuo Google Sheet
const SPREADSHEET_ID = 'IL_TUO_SPREADSHEET_ID_QUI';
const SHEET_NAME = 'Iscrizioni';

// Lista completa delle nazioni disponibili
const ALL_COUNTRIES = [
  { name: 'Italia', icon: 'it' },
  { name: 'Jamaica', icon: 'jm' },
  { name: 'Giappone', icon: 'jp' },
  { name: 'Argentina', icon: 'ar' },
  { name: 'Svizzera', icon: 'ch' },
  { name: 'Germania', icon: 'de' },
  { name: 'Città del Vaticano', icon: 'va' },
  { name: 'Cuba', icon: 'cu' },
  { name: 'Brasile', icon: 'br' },
  { name: 'Australia', icon: 'au' },
  { name: 'Irlanda', icon: 'ie' },
  { name: 'Spagna', icon: 'es' },
  { name: 'Usa', icon: 'us' },
  { name: 'India', icon: 'in' },
  { name: 'Perù', icon: 'pe' },
  { name: 'Scozia', icon: 'gb-sct' },
  { name: 'Francia', icon: 'fr' },
  { name: 'Messico', icon: 'mx' },
  { name: 'Egitto', icon: 'eg' },
  { name: 'Hawaii', icon: 'us-hi' },
  { name: 'Groenlandia', icon: 'gl' },
  { name: 'Olanda', icon: 'nl' },
  { name: 'Norvegia', icon: 'no' },
  { name: 'Arabia', icon: 'ae' }
];

/**
 * Gestisce le richieste GET - ritorna le nazioni disponibili
 */
function doGet(e) {
  try {
    const availableCountries = getAvailableCountries();

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        countries: availableCountries,
        totalSlots: ALL_COUNTRIES.length,
        takenSlots: ALL_COUNTRIES.length - availableCountries.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gestisce le richieste POST - salva una nuova iscrizione
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Verifica che la nazione sia ancora disponibile
    const availableCountries = getAvailableCountries();
    const isAvailable = availableCountries.some(c => c.name === data.nazione);

    if (!isAvailable) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'La nazione selezionata non è più disponibile. Ricarica la pagina e scegli un\'altra nazione.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Salva l'iscrizione
    saveRegistration(data);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Iscrizione completata con successo!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Ottiene le nazioni ancora disponibili
 */
function getAvailableCountries() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // La colonna "Nazione" è la colonna 18 (indice 17) - adatta se necessario
  const nazioneColumnIndex = 17;

  // Raccogli tutte le nazioni già scelte (salta la riga header)
  const takenCountries = new Set();
  for (let i = 1; i < data.length; i++) {
    if (data[i][nazioneColumnIndex]) {
      takenCountries.add(data[i][nazioneColumnIndex].trim());
    }
  }

  // Filtra le nazioni disponibili
  return ALL_COUNTRIES.filter(country => !takenCountries.has(country.name));
}

/**
 * Salva una nuova iscrizione nel foglio
 */
function saveRegistration(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  const timestamp = new Date().toLocaleString('it-IT');

  const row = [
    timestamp,
    data.email,
    data.p1_nome,
    data.p1_nascita,
    data.p1_cai,
    data.p1_cf,
    data.p1_telefono,
    data.p1_indirizzo,
    data.p2_nome,
    data.p2_nascita,
    data.p2_cai,
    data.p2_cf,
    data.p2_telefono,
    data.p2_indirizzo,
    data.rapp_nome,
    data.rapp_telefono,
    data.rapp_email,
    data.nazione,
    data.pagamento
  ];

  sheet.appendRow(row);
}

/**
 * Funzione di test per verificare il setup
 * Esegui questa funzione manualmente per testare
 */
function testSetup() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    Logger.log('Connessione al foglio riuscita!');
    Logger.log('Numero di righe: ' + sheet.getLastRow());

    const available = getAvailableCountries();
    Logger.log('Nazioni disponibili: ' + available.map(c => c.name).join(', '));
  } catch (error) {
    Logger.log('Errore: ' + error.message);
  }
}
