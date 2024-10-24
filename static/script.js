// Get elements from the DOM
let userInput = document.getElementById('user-input');
let chatBox = document.getElementById('chat-box');

// Function to check if Enter key is pressed
function checkEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Function to send a message
function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessageToChatBox(message, 'user'); // Show user message
        userInput.value = ''; // Clear input field

        // Send the message to the server
        fetch('/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // Add bot message with typing animation
            addMessageToChatBox(data.response, 'bot'); // Show bot response
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Function to add message to chat box with typing animation
function addMessageToChatBox(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender + '-message', 'message');
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom

    // Typing animation effect
    let index = 0;
    const typingSpeed = 50; // Adjust typing speed here

    function typeMessage() {
        if (index < message.length) {
            const char = message.charAt(index);
            messageDiv.innerHTML += char === ' ' ? '&nbsp;' : char; // Append one character at a time
            index++;
            setTimeout(typeMessage, typingSpeed);
        }
    }

    // Start typing animation for bot messages
    if (sender === 'bot') {
        // Start typing animation after a slight delay
        setTimeout(typeMessage, 500); // Optional delay before typing starts
    } else {
        messageDiv.innerText = message; // Show user message immediately
    }
}

// Automatically greet the user on page load
window.onload = function() {
    addMessageToChatBox("Welcome to Chatterbot!", 'bot');
};
