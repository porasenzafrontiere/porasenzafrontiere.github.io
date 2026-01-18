# Setup Iscrizioni PSF 2026

Questa guida spiega come configurare il sistema di iscrizioni con selezione automatica delle nazioni.

## Panoramica

Il sistema funziona così:
1. **Google Sheet** = database delle iscrizioni
2. **Google Apps Script** = API che gestisce la logica (quali nazioni sono disponibili)
3. **Sito web** = form di iscrizione che comunica con l'API

---

## STEP 1: Crea il Google Sheet

1. Vai su [Google Sheets](https://sheets.google.com) e crea un nuovo foglio
2. Rinomina il foglio (tab in basso) in **"Iscrizioni"**
3. Nella **riga 1**, aggiungi queste intestazioni di colonna:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Email | P1 Nome | P1 Nascita | P1 CAI | P1 CF | P1 Telefono | P1 Indirizzo | P2 Nome | P2 Nascita | P2 CAI | P2 CF | P2 Telefono | P2 Indirizzo | Rapp Nome | Rapp Telefono | Rapp Email | Nazione | Pagamento |

4. **Copia l'ID del foglio** dalla URL:
   ```
   https://docs.google.com/spreadsheets/d/QUESTO_È_L_ID/edit
   ```
   L'ID è la stringa lunga tra `/d/` e `/edit`

### Importare le iscrizioni esistenti (opzionale)

Se vuoi mantenere le iscrizioni già fatte con Google Forms:
1. Apri il file CSV esistente
2. Copia i dati nel nuovo foglio, assicurandoti che le colonne corrispondano

---

## STEP 2: Configura Google Apps Script

1. Vai su [Google Apps Script](https://script.google.com)
2. Clicca su **"Nuovo Progetto"**
3. Rinomina il progetto in "PSF Iscrizioni API"
4. **Cancella** tutto il codice esistente
5. **Copia e incolla** tutto il contenuto del file `google-apps-script.js` di questo repository
6. **IMPORTANTE**: Trova questa riga nel codice:
   ```javascript
   const SPREADSHEET_ID = 'IL_TUO_SPREADSHEET_ID_QUI';
   ```
   e sostituisci `IL_TUO_SPREADSHEET_ID_QUI` con l'ID del tuo foglio Google (copiato allo Step 1)

7. Clicca su **Salva** (icona dischetto o Ctrl+S)

### Deploy dell'API

1. Clicca su **Deploy** > **Nuova distribuzione**
2. Clicca sull'icona ingranaggio e seleziona **"App web"**
3. Configura:
   - **Descrizione**: "API Iscrizioni PSF"
   - **Esegui come**: "Me" (il tuo account)
   - **Chi ha accesso**: "Chiunque"
4. Clicca su **Distribuzione**
5. **Autorizza** l'app quando richiesto (clicca su "Avanzate" > "Vai a PSF Iscrizioni API")
6. **Copia l'URL** della web app (simile a: `https://script.google.com/macros/s/XXXXX/exec`)

---

## STEP 3: Configura il sito web

1. Apri il file `assets/js/signup.js`
2. Trova questa riga all'inizio:
   ```javascript
   const API_URL = 'INSERISCI_QUI_URL_GOOGLE_APPS_SCRIPT';
   ```
3. Sostituisci `INSERISCI_QUI_URL_GOOGLE_APPS_SCRIPT` con l'URL copiato allo Step 2

---

## STEP 4: Test

1. Avvia il sito in locale:
   ```bash
   bundle exec jekyll serve
   ```
2. Vai su `http://localhost:4000/iscrizione/`
3. Verifica che le nazioni si caricano correttamente
4. Fai una iscrizione di test
5. Controlla che i dati appaiano nel Google Sheet

---

## STEP 5: Deploy

Fai il commit e push delle modifiche:
```bash
git add .
git commit -m "Aggiunto sistema iscrizioni integrato"
git push
```

GitHub Pages pubblicherà automaticamente il sito aggiornato.

---

## Troubleshooting

### Le nazioni non si caricano
- Verifica che l'URL dell'API sia corretto in `signup.js`
- Verifica che lo Spreadsheet ID sia corretto in Google Apps Script
- Controlla che il foglio si chiami esattamente "Iscrizioni"

### Errore "Nazione non disponibile"
- La nazione è stata scelta da un altro utente mentre compilavi il form
- Ricarica la pagina e scegli un'altra nazione

### Come aggiungere/rimuovere nazioni
- Modifica l'array `ALL_COUNTRIES` nel file `google-apps-script.js`
- Modifica anche `services` in `_data/settings.yml` per aggiornarle sul sito

### Come rimuovere un'iscrizione
- Apri il Google Sheet
- Elimina la riga corrispondente
- La nazione tornerà disponibile automaticamente

---

## File modificati/creati

| File | Descrizione |
|------|-------------|
| `google-apps-script.js` | Codice da copiare in Google Apps Script |
| `_pages/iscrizione.html` | Nuova pagina iscrizione |
| `_layouts/signup.html` | Layout per la pagina iscrizione |
| `_includes/signup-form.html` | Form di iscrizione |
| `assets/js/signup.js` | JavaScript per gestione form |
| `_data/settings.yml` | Aggiornato menu navigazione |
| `_includes/contact-section.html` | Aggiornato link iscrizione |
