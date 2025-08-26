'use strict';

// DOM Elements
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');

let stompClient = null;
let username = null;

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A52', '#0ABDE3', '#C44569', '#F8B500'
];

// Enhanced animations
function addMessageWithAnimation(messageElement) {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(-30px) scale(0.9)';
    messageArea.appendChild(messageElement);

    // Trigger animation
    requestAnimationFrame(() => {
        messageElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(0) scale(1)';
    });

    messageArea.scrollTop = messageArea.scrollHeight;
}

function connect(event) {
    event.preventDefault();

    username = document.querySelector('#name').value.trim();

    if (username) {
        // Add transition effect
        usernamePage.style.transition = 'all 0.3s ease';
        usernamePage.style.opacity = '0';
        usernamePage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            usernamePage.classList.add('hidden');
            chatPage.classList.remove('hidden');
            chatPage.style.opacity = '0';

            requestAnimationFrame(() => {
                chatPage.style.transition = 'opacity 0.6s ease';
                chatPage.style.opacity = '1';
            });
        }, 300);

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send("/app/chat.addUser", {}, JSON.stringify({
        sender: username,
        type: 'JOIN'
    }));

    connectingElement.style.transition = 'opacity 0.3s ease';
    connectingElement.style.opacity = '0';
    setTimeout(() => {
        connectingElement.classList.add('hidden');
    }, 300);
}

function onError(error) {
    connectingElement.textContent = 'Connection failed. Please refresh and try again!';
    connectingElement.style.color = '#FF6B6B';
}

function sendMessage(event) {
    event.preventDefault();

    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));

        // Animate input clear
        messageInput.style.transition = 'transform 0.15s ease';
        messageInput.style.transform = 'scale(0.98)';
        messageInput.value = '';

        setTimeout(() => {
            messageInput.style.transform = 'scale(1)';
        }, 150);
    }
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    const messageElement = document.createElement('li');
    messageElement.className = 'message-item';

    if (message.type === 'JOIN') {
        messageElement.innerHTML = `
            <div class="event-message">
                🎉 ${message.sender} joined the chat!
            </div>
        `;
    } else if (message.type === 'LEAVE') {
        messageElement.innerHTML = `
            <div class="event-message">
                👋 ${message.sender} left the chat
            </div>
        `;
    } else {
        const avatarColor = getAvatarColor(message.sender);
        messageElement.innerHTML = `
            <div class="chat-message">
                <div class="avatar" style="background: ${avatarColor}">
                    ${message.sender[0].toUpperCase()}
                </div>
                <div class="message-content">
                    <div class="message-sender">${message.sender}</div>
                    <div class="message-text">${message.content}</div>
                </div>
            </div>
        `;
    }

    addMessageWithAnimation(messageElement);
}

function getAvatarColor(messageSender) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

// Enhanced input interactions
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(e);
    }
});

// Add focus animations
messageInput.addEventListener('focus', () => {
    messageInput.parentElement.style.transition = 'transform 0.2s ease';
    messageInput.parentElement.style.transform = 'translateY(-2px)';
});

messageInput.addEventListener('blur', () => {
    messageInput.parentElement.style.transform = 'translateY(0)';
});

// Event listeners
usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);

// Add some floating particles for extra visual appeal
function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    particle.style.opacity = '0';
    particle.style.zIndex = '1';

    document.body.appendChild(particle);

    const duration = Math.random() * 3000 + 2000;
    const drift = (Math.random() - 0.5) * 100;

    particle.animate([
        { transform: 'translateY(0px) translateX(0px)', opacity: 0 },
        { transform: `translateY(-100vh) translateX(${drift}px)`, opacity: 1 }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => {
        particle.remove();
    };
}

// Create floating particles occasionally
setInterval(createFloatingParticle, 3000);