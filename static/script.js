// Define the sendQuery() function
async function sendQuery() {
  const userInput = document.getElementById('user-input').value;
  const chatHistory = document.getElementById('chat-history');

  // Get the current chat history from the DOM
  const chatMessages = chatHistory.getElementsByClassName('bot-response');
  const history = []; // Initialize an empty history
  for (let i = 0; i < chatMessages.length; i++) {
    history.push(chatMessages[i].textContent);
  }

  // Send the query and chat history to the backend
  const response = await axios.post('http://localhost:5000/query', {
    query: userInput,
    history,
  });

  // Append bot's response to the chat history
  const userQuestion = document.createElement('div');
  userQuestion.classList.add('user-question');
  userQuestion.classList.add('message');
  userQuestion.textContent = userInput;
  chatHistory.appendChild(userQuestion);

  // Append bot's response to the chat history
  const botResponse = document.createElement('div');
  botResponse.classList.add('bot-response');
  botResponse.classList.add('message');
  botResponse.textContent = response.data.answer;
  chatHistory.appendChild(botResponse);

  // Clear the user input field
  document.getElementById('user-input').value = '';
}

function clearChat() {
  const chatHistory = document.getElementById('chat-history');
  chatHistory.innerHTML = ''; // Clear the content of the chat history
}

function createCalendar(year, month) {
  // Get the first day of the month
  const firstDay = new Date(year, month, 1).getDay();

  // Get the number of days in the month
  const numDays = new Date(year, month + 1, 0).getDate();

  // Create the calendar table
  let table = document.createElement('table');
  table.setAttribute('id', 'calendar-table');

  // Create table headers
  let headerRow = document.createElement('tr');
  for (let i = 0; i < 7; i++) {
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
    let headerCell = document.createElement('th');
    headerCell.textContent = dayName;
    headerRow.appendChild(headerCell);
  }
  table.appendChild(headerRow);

  // Create calendar body
  let body = document.createElement('tbody');
  for (let week = 0; week < 6; week++) {
    let weekRow = document.createElement('tr');
    for (let day = 0; day < 7; day++) {
      let cellNumber = week * 7 + day + 1 - firstDay;
      let cell = document.createElement('td');
      if (cellNumber > 0 && cellNumber <= numDays) {
        cell.textContent = cellNumber;

        // Add event listener for clicking on a date cell
        cell.addEventListener('click', () => {
          console.log('Date clicked: ' + cell.textContent);
        });
      }
      weekRow.appendChild(cell);
    }
    body.appendChild(weekRow);
  }
  table.appendChild(body);

  // Clear existing calendar and append the new one
  const calendarEl = document.getElementById('calendar');
  calendarEl.innerHTML = '';
  calendarEl.appendChild(table);
}

document.addEventListener('DOMContentLoaded', function() {
  // Add an event listener to the button
  document.getElementById('submit-button').addEventListener('click', sendQuery);

  // Create calendar after DOMContentLoaded event
  createCalendar(new Date().getFullYear(), new Date().getMonth());
});
