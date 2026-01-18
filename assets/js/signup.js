/**
 * PSF 2026 - Signup Form Handler
 *
 * CONFIGURAZIONE: Sostituisci l'URL qui sotto con l'URL del tuo Google Apps Script deployment
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbzKHBafUyQRKxWRSf9pC6kHECsf4RmnCLjSImuQqgWO9Y8o9Fra04J9zll8o5i8c2dvkQ/exec';

/**
 * Carica le nazioni disponibili all'avvio della pagina
 */
document.addEventListener('DOMContentLoaded', function() {
  loadAvailableCountries();
  setupFormValidation();
});

/**
 * Carica le nazioni disponibili dal backend
 */
async function loadAvailableCountries() {
  const select = document.getElementById('nazione');
  const loadingSpinner = document.getElementById('loading-countries');
  const availableCount = document.getElementById('available-count');

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.success) {
      // Aggiorna il contatore
      availableCount.textContent = data.countries.length;

      // Popola il dropdown
      select.innerHTML = '<option value="">-- Seleziona una nazione --</option>';

      data.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name;
        option.textContent = country.name;
        option.dataset.icon = country.icon;
        select.appendChild(option);
      });

      // Nascondi lo spinner
      loadingSpinner.classList.add('d-none');

      // Se non ci sono nazioni disponibili
      if (data.countries.length === 0) {
        select.innerHTML = '<option value="">Tutte le nazioni sono state assegnate!</option>';
        select.disabled = true;
        document.getElementById('submit-btn').disabled = true;
        availableCount.classList.remove('bg-success');
        availableCount.classList.add('bg-danger');
      }
    } else {
      throw new Error(data.error || 'Errore nel caricamento delle nazioni');
    }
  } catch (error) {
    console.error('Errore:', error);
    loadingSpinner.classList.add('d-none');
    availableCount.textContent = '?';
    select.innerHTML = '<option value="">Errore nel caricamento - ricarica la pagina</option>';

    // Mostra messaggio di errore
    showError('Impossibile caricare le nazioni disponibili. Verifica la connessione e ricarica la pagina.');
  }
}

/**
 * Setup della validazione del form
 */
function setupFormValidation() {
  const form = document.getElementById('signup-form');

  // Converti codice fiscale in maiuscolo
  document.getElementById('p1_cf').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });
  document.getElementById('p2_cf').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    event.stopPropagation();

    // Valida il form
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      // Scroll al primo campo con errore
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // Invia il form
    await submitForm();
  });
}

/**
 * Invia il form al backend
 */
async function submitForm() {
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');
  const form = document.getElementById('signup-form');

  // Disabilita il pulsante e mostra lo spinner
  submitBtn.disabled = true;
  submitText.textContent = 'Invio in corso...';
  submitSpinner.classList.remove('d-none');

  // Raccogli i dati dal form
  const formData = {
    email: document.getElementById('email').value,
    p1_nome: document.getElementById('p1_nome').value,
    p1_nascita: document.getElementById('p1_nascita').value,
    p1_cai: document.querySelector('input[name="p1_cai"]:checked').value,
    p1_cf: document.getElementById('p1_cf').value.toUpperCase(),
    p1_telefono: document.getElementById('p1_telefono').value,
    p1_indirizzo: document.getElementById('p1_indirizzo').value,
    p2_nome: document.getElementById('p2_nome').value,
    p2_nascita: document.getElementById('p2_nascita').value,
    p2_cai: document.querySelector('input[name="p2_cai"]:checked').value,
    p2_cf: document.getElementById('p2_cf').value.toUpperCase(),
    p2_telefono: document.getElementById('p2_telefono').value,
    p2_indirizzo: document.getElementById('p2_indirizzo').value,
    rapp_nome: document.getElementById('rapp_nome').value,
    rapp_telefono: document.getElementById('rapp_telefono').value,
    rapp_email: document.getElementById('rapp_email').value,
    nazione: document.getElementById('nazione').value,
    pagamento: document.querySelector('input[name="pagamento"]:checked').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script richiede no-cors
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    // Con no-cors non possiamo leggere la risposta, quindi assumiamo successo
    // In caso di errore reale (nazione già presa), il backend non salverà
    showSuccess();
    form.reset();
    form.classList.remove('was-validated');

    // Ricarica le nazioni per aggiornare la lista
    setTimeout(() => {
      loadAvailableCountries();
    }, 2000);

  } catch (error) {
    console.error('Errore:', error);
    showError('Errore durante l\'invio. Riprova più tardi.');

    // Riabilita il pulsante
    submitBtn.disabled = false;
    submitText.textContent = 'Invia Iscrizione';
    submitSpinner.classList.add('d-none');
  }
}

/**
 * Mostra un messaggio di errore
 */
function showError(message) {
  const errorDiv = document.getElementById('form-error');
  errorDiv.textContent = message;
  errorDiv.classList.remove('d-none');

  // Nascondi il messaggio di successo
  document.getElementById('form-success').classList.add('d-none');

  // Scroll al messaggio
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Mostra il messaggio di successo
 */
function showSuccess() {
  const successDiv = document.getElementById('form-success');
  const errorDiv = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  successDiv.classList.remove('d-none');
  errorDiv.classList.add('d-none');
  submitBtn.classList.add('d-none');

  // Scroll al messaggio
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
