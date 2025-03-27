import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import roomRoutes from './routes/room.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI não está definido nas variáveis de ambiente');
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const port = process.env.PORT || 3000;
    httpServer.listen(port, () => {
      console.info(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  });

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Autenticação necessária'));
  }
  next();
});

io.on('connection', (socket) => {
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
  });

  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on('send_message', (data: { roomId: string; message: string }) => {
    io.to(data.roomId).emit('receive_message', {
      message: data.message,
      senderId: socket.id,
      timestamp: new Date()
    });
  });

  socket.on('typing', (data: { roomId: string; isTyping: boolean }) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: socket.id,
      isTyping: data.isTyping
    });
  });
}); 