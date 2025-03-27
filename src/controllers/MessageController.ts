import { Request, Response } from 'express';
import { Message, IMessage } from '../entities/Message';
import { Room } from '../entities/Room';
import mongoose from 'mongoose';

export class MessageController {
  async create(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const { content, roomId, recipientId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          message: 'Sala não encontrada',
        });
      }

      if (!room.participants.includes(new mongoose.Types.ObjectId(userId))) {
        return res.status(403).json({
          message: 'Você não é participante desta sala',
        });
      }

      const message = await Message.create({
        content,
        sender: userId,
        room: roomId,
        recipientId,
      });

      await message.populate('sender', 'username');

      return res.status(201).json({
        message: 'Mensagem enviada com sucesso',
        data: message,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao enviar mensagem',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async listByRoom(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          message: 'Sala não encontrada',
        });
      }

      if (!room.participants.includes(new mongoose.Types.ObjectId(userId))) {
        return res.status(403).json({
          message: 'Você não é participante desta sala',
        });
      }

      const messages = await Message.find({ room: roomId })
        .populate('sender', 'username')
        .sort({ createdAt: 1 });

      return res.json(messages);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao listar mensagens',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async listPrivateMessages(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const messages = await Message.find({
        $or: [
          { sender: userId, recipientId: { $exists: true } },
          { recipientId: userId },
        ],
      })
        .populate('sender', 'username')
        .sort({ createdAt: 1 });

      return res.json(messages);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao listar mensagens privadas',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async markAsRead(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const { messageId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          message: 'Mensagem não encontrada',
        });
      }

      if (message.recipientId !== userId) {
        return res.status(403).json({
          message: 'Você não tem permissão para marcar esta mensagem como lida',
        });
      }

      message.isRead = true;
      await message.save();

      return res.json({
        message: 'Mensagem marcada como lida',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao marcar mensagem como lida',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
} 