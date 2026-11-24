const rates = { conservador: .06, moderado: .08, agresivo: .10 };
const dialog = document.createElement('dialog');
dialog.className = 'projection-request';
dialog.setAttribute('aria-labelledby', 'projection-request-title');
dialog.innerHTML = `
  <form>
    <h2 id="projection-request-title">Recibe tu proyección por correo</h2>
    <p>Te enviaremos un PDF con tu proyección anual de OptiMaxx plus (Art. 151).</p>
    <p data-scenario></p>
    <label>Nombre completo <input name="name" autocomplete="name" required minlength="2" maxlength="100"></label>
    <label>Correo electrónico <input name="email" type="email" autocomplete="email" required maxlength="254"></label>
    <label>Teléfono de WhatsApp (opcional) <input name="phone" type="tel" autocomplete="tel" maxlength="25" placeholder="Ej. +52 55 1234 5678"></label>
    <div class="projection-request-numbers">
      <label>Aportación mensual (mín. $2,000) <input name="monthly" type="number" min="2000" max="50000" step="1" required></label>
      <label>Plazo comprometido <input name="years" type="number" min="10" max="25" step="1" required></label>
      <label>Ingreso anual acumulable (opcional) <input name="income" type="number" min="0" max="100000000" step="1"></label>
      <label>Tasa marginal de ISR % (opcional) <input name="isr" type="number" min="0" max="35" step=".01"></label>
    </div>
    <p>Usaremos tu correo para enviarte el PDF. Si dejas tu número, podremos dar seguimiento por WhatsApp.</p>
    <p>Completa ingreso e ISR para estimar la deducción. La proyección es ilustrativa.</p>
    <p data-feedback role="status" aria-live="polite"></p>
    <div class="projection-request-actions">
      <button type="button" data-close>Cerrar</button>
      <button type="submit">Enviar mi proyección</button>
    </div>
  </form>
`;
document.body.append(dialog);
const confirmation = document.createElement('dialog');
confirmation.className = 'projection-request projection-confirmation';
confirmation.setAttribute('aria-labelledby', 'projection-confirmation-title');
confirmation.setAttribute('aria-describedby', 'projection-confirmation-message');
confirmation.innerHTML = `
  <form method="dialog">
    <h2 id="projection-confirmation-title">¡Ya tenemos tu solicitud!</h2>
    <p id="projection-confirmation-message">Tu proyección va en camino. Revisa tu correo en unos minutos.</p>
    <div class="projection-request-actions"><button autofocus>Cerrar</button></div>
  </form>
`;
document.body.append(confirmation);

const form = dialog.querySelector('form');
const feedback = form.querySelector('[data-feedback]');
const submit = form.querySelector('[type="submit"]');
let scenario;
let sending = false;
const close = form.querySelector('[data-close]');
close.addEventListener('click', () => dialog.close());
dialog.addEventListener('cancel', (event) => { if (sending) event.preventDefault(); });

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || !event.target.closest('#simulador [data-testid="download-pdf-button"]')) return;
  event.preventDefault();
  event.stopPropagation();

  const age = Number(document.getElementById('age-slider')?.value);
  const monthly = Number(document.getElementById('monthly-slider')?.value);
  const profile = document.querySelector('#simulador [data-testid^="risk-chip-"][aria-pressed="true"]');
  const rate = rates[profile?.dataset.testid?.replace('risk-chip-', '')];
  form.reset();
  scenario = { age, rate };
  form.elements.namedItem('monthly').value = Math.max(2000, monthly);
  form.elements.namedItem('years').value = Math.min(25, Math.max(10, 65 - age));
  form.querySelector('[data-scenario]').textContent = `${age} años · ${rate * 100}% de rendimiento anual supuesto.`;
  feedback.textContent = monthly < 2000 ? 'La aportación del simulador era menor al mínimo. Puedes editar el monto de la proyección aquí, desde $2,000 al mes.' : '';
  submit.disabled = !rate;
  if (!dialog.open) dialog.showModal();
}, { capture: true });

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submit.disabled || !scenario) return;
  const data = new FormData(form);
  const income = Number(data.get('income'));
  const isr = Number(data.get('isr')) / 100;
  sending = true;
  close.disabled = true;
  submit.disabled = true;
  let sent = false;
  feedback.textContent = 'Estamos preparando tu PDF…';
  try {
    const response = await fetch('/api/send-projection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...scenario, name: String(data.get('name')).trim(), email: String(data.get('email')).trim(),
        phone: String(data.get('phone') ?? '').trim(),
        monthly: Number(data.get('monthly')), years: Number(data.get('years')),
        income: income && isr ? income : 0, isr: income && isr ? isr : 0,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.error || 'No se pudo enviar la solicitud.');
    sent = true;
    dialog.close();
    confirmation.showModal();
  } catch (error) {
    feedback.textContent = error.message || 'No se pudo enviar. Intenta de nuevo.';
  } finally {
    sending = false;
    close.disabled = false;
    submit.disabled = sent;
  }
});
