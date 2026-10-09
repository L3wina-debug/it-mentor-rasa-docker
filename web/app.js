const messages = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const sender = `web-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

function addMessage(text, type) {
  const article = document.createElement('article');
  article.className = `message ${type}`;
  const safeText = text.replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c])).replace(/\n/g, '<br>');
  article.innerHTML = type === 'bot'
    ? `<div class="avatar">IT</div><div><div class="bubble">${safeText}</div><time>maintenant</time></div>`
    : `<div><div class="bubble">${safeText}</div><time>maintenant</time></div>`;
  messages.appendChild(article);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  input.value = '';
  input.disabled = true;
  try {
    const response = await fetch('/webhooks/rest/webhook', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ sender, message:text }) });
    if (!response.ok) throw new Error('Service indisponible');
    const replies = await response.json();
    if (replies.length) replies.forEach(reply => addMessage(reply.text || 'Je n’ai pas de réponse texte pour le moment.', 'bot'));
    else addMessage('Je n’ai pas compris. Essayez une question sur l’informatique.', 'bot');
  } catch (error) {
    addMessage('Le service Rasa est indisponible. Vérifiez que les conteneurs Docker sont démarrés.', 'bot');
  } finally { input.disabled = false; input.focus(); }
}

form.addEventListener('submit', event => { event.preventDefault(); sendMessage(input.value); });
document.querySelectorAll('.suggestions button').forEach(button => button.addEventListener('click', () => sendMessage(button.textContent)));
