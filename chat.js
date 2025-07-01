const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatToggle = document.getElementById('chat-toggle');
const closeBtn = document.getElementById('close-btn');
const chatContainer = document.querySelector('.chat-container');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => {
  chatContainer.style.display = 'flex';
  chatToggle.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
  chatContainer.style.display = 'none';
  chatToggle.style.display = 'block';
});

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

function addMessage(message, sender) {
  const messageElem = document.createElement('div');
  messageElem.className = `message ${sender}`;
  messageElem.textContent = message;
  chatMessages.appendChild(messageElem);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';
  addMessage('...', 'bot');

  try {
    const response = await fetch('https://joedills.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Remove placeholder "..." message
    const loadingMsg = document.querySelector('.message.bot:last-child');
    if (loadingMsg) loadingMsg.remove();

    if (response.ok && data.reply) {
      addMessage(data.reply, 'bot');
    } else {
      addMessage('Sorry, something went wrong.', 'bot');
    }
  } catch (error) {
    const loadingMsg = document.querySelector('.message.bot:last-child');
    if (loadingMsg) loadingMsg.remove();
    addMessage('Unable to connect. Please try again later.', 'bot');
    console.error('Error sending message:', error);
  }
}
