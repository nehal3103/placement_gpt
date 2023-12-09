// Define the sendQuery() function
async function sendQuery() {
  const userInput = document.getElementById("user-input").value;
  const chatHistory = document.getElementById("chat-history");

  // Get the current chat history from the DOM
  const chatMessages = chatHistory.getElementsByClassName("bot-response");
  const history = []; // Initialize an empty history
  for (let i = 0; i < chatMessages.length; i++) {
    history.push(chatMessages[i].textContent);
  }

  // Send the query and chat history to the backend
  const response = await axios.post("http://localhost:5000/query", {
    query: userInput,
    history: history,
  });

  // Append bot's response to the chat history
  const userQuestion = document.createElement("div");
  userQuestion.classList.add("user-question");
  userQuestion.classList.add("message");
  userQuestion.textContent = userInput;
  chatHistory.appendChild(userQuestion);

  // Append bot's response to the chat history
  const botResponse = document.createElement("div");
  botResponse.classList.add("bot-response");
  botResponse.classList.add("message");
  botResponse.textContent = response.data.answer;
  chatHistory.appendChild(botResponse);

  // Clear the user input field
  document.getElementById("user-input").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
  // Add an event listener to the button
  document.getElementById("submit-button").addEventListener("click", sendQuery);
});

function clearChat() {
  const chatHistory = document.getElementById("chat-history");
  chatHistory.innerHTML = ""; // Clear the content of the chat history
}
