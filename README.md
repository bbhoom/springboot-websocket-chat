# Spring Boot WebSocket Chat

A simple real-time chat application built with **Spring Boot**, **STOMP over WebSockets**, and **SockJS**.  
Users can join with a username and exchange messages in a shared chatroom.

---
## Check Live Site 
https://springboot-websocket-chat-jnjb.onrender.com/ 

## 🚀 Features
- WebSocket-based real-time communication
- STOMP protocol support
- SockJS fallback for browsers without native WebSocket support
- Join/leave notifications
- Simple UI with HTML, CSS, and JavaScript

---
## ⚡ Getting Started

### 1. Clone the repo

git clone https://github.com/bbhoom/springboot-websocket-chat.git

cd springboot-websocket-chat

###  2. Run the app
Using Maven Wrapper:
./mvnw spring-boot:run

 Or 

with Maven installed:
mvn spring-boot:run

###  3. Access in browser
Open:
http://localhost:8080/index.html
📡 WebSocket Endpoints
STOMP Endpoint: /ws

App Prefix: /app

Message Broker: /topic

Example:

Client sends messages to: /app/chat.sendMessage

Server broadcasts messages to: /topic/public

### 📸 Screenshots
<img width="1203" height="803" alt="image" src="https://github.com/user-attachments/assets/fa1dda65-132e-4be8-9035-38f4aba6a596" />
<img width="1675" height="913" alt="image" src="https://github.com/user-attachments/assets/7f342060-8fab-4a48-aca0-a59ff341847c" />


## 🛠️ Built With
-Spring Boot
-Spring WebSocket
-SockJS
-STOMP.js
