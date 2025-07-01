// ========== Chat Box UI Logic ==========
document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById("chat-icon");
  const chatBox = document.getElementById("chat-box");
  const closeChat = document.getElementById("close-chat");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const messagesContainer = document.getElementById("messages");

  chatIcon.addEventListener("click", () => {
    chatBox.style.display = "flex";
    chatIcon.style.display = "none";
  });

  closeChat.addEventListener("click", () => {
    chatBox.style.display = "none";
    chatIcon.style.display = "block";
  });

  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function appendMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot");
    loadingMsg.textContent = "...";
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await fetch("https://joedills.vercel.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      loadingMsg.remove();
      appendMessage("bot", data.reply);
    } catch (error) {
      loadingMsg.remove();
      appendMessage("bot", "Oops, something went wrong. Try again.");
    }
  }
});
