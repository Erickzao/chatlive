# ChatLive

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

[![CI/CD](https://github.com/Erickzao/chatlive/actions/workflows/main.yml/badge.svg)](https://github.com/Erickzao/chatlive/actions/workflows/main.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue.svg)](https://www.typescriptlang.org/)

Real-time chat system built with TypeScript, Express, Socket.IO, and MongoDB.

[Live Demo](https://chatlive-demo.herokuapp.com) | [API Documentation](https://chatlive-demo.herokuapp.com/api-docs)

## 🚀 Features

- ✨ JWT Authentication
- 💬 Real-time chat rooms
- 📱 Online/Offline status
- 🔒 Private messaging
- ⌨️ Typing indicators
- 📜 Message history
- 🔍 Room listing
- 👥 User management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- NPM or Yarn

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/Erickzao/chatlive.git
cd chat-live
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file with your settings

4. Start the server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection URI | mongodb://localhost:27017/chat-live |
| JWT_SECRET | JWT secret key | your_jwt_secret_here |
| JWT_EXPIRATION | Token expiration time | 24h |

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout
- `GET /api/users/me` - Get current user data

### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms` - List rooms
- `GET /api/rooms/:id` - Room details
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/room/:roomId` - Room messages
- `GET /api/messages/private` - Private messages
- `PATCH /api/messages/:messageId/read` - Mark as read

## 🔌 WebSocket Events

### Client → Server
```typescript
// Join a room
socket.emit('join_room', { roomId: string });

// Send message
socket.emit('send_message', {
  roomId: string,
  content: string
});

// Indicate typing
socket.emit('typing', {
  roomId: string,
  isTyping: boolean
});
```

### Server → Client
```typescript
// Receive message
socket.on('receive_message', (data: {
  message: string,
  senderId: string,
  timestamp: Date
}) => {});

// User typing
socket.on('user_typing', (data: {
  userId: string,
  isTyping: boolean
}) => {});
```

## 🔒 Security

- JWT Authentication
- Input sanitization
- XSS Protection
- Rate limiting
- Data validation
- Password encryption

## 🧪 Testing

```bash
# Run tests
npm test

# Test coverage
npm run test:coverage
```

## 📦 Project Structure

```
src/
├── config/         # Configuration
├── controllers/    # Controllers
├── entities/       # Models
├── middlewares/   # Middlewares
├── routes/        # Routes
└── index.ts       # Entry point
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@Erickzao](https://github.com/Erickzao/chatlive.git)