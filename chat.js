let chatVisible = false;
let inactivityTimer;
const webhookURL = "https://hook.us2.make.com/lm78sp5thnp7a2gjf3paw9w9rlujvuie";

// Elements
const chatIcon = document.getElementById("chat-icon");
const chatBox = document.getElementById("chat-box");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const closeBtn = document.getElementById("close-btn");
const endBtn = document.getElementById("end-chat-btn");

// Open chat
chatIcon.addEventListener("click", () => {
  chatBox.style.display = "block";
  chatIcon.style.display = "none";
  chatVisible = true;
  scrollToBottom();
});

// Close chat
closeBtn.addEventListener("click", () => {
  chatBox.style.display = "none";
  chatIcon.style.display = "block";
  chatVisible = false;
  sendWebhook("User closed the chat box.");
});

// End chat
endBtn.addEventListener("click", () => {
  addMessage("Team Dills", "Thanks for reaching out. We're always here if you need anything else.");
  sendWebhook("User clicked 'No further questions'");
});

// Send message
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const userInput = chatInput.value.trim();
  if (!userInput) return;
  addMessage("You", userInput);
  chatInput.value = "";

  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput })
  })
    .then(res => res.json())
    .then(data => {
      addMessage("Team Dills", data.reply);
      resetInactivityTimer();
    })
    .catch(() => {
      addMessage("Team Dills", "Sorry, there was an error. Please try again.");
    });
}

function addMessage(sender, message) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender === "You" ? "user" : "bot");
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(msg);
  scrollToBottom();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (chatVisible) {
      sendWebhook("User was inactive for 30 seconds after last reply.");
    }
  }, 30000);
}

function sendWebhook(reason) {
  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: reason, timestamp: new Date().toISOString() })
  }).catch(err => console.error("Webhook failed:", err));
}
