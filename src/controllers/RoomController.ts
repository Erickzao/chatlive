import { Request, Response } from 'express';
import { Room, IRoom } from '../entities/Room';
import { User } from '../entities/User';
import mongoose from 'mongoose';

export class RoomController {
  async create(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const { name, description, isPrivate } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const room = await Room.create({
        name,
        description,
        isPrivate,
        creator: userId,
        participants: [new mongoose.Types.ObjectId(userId)],
      });

      return res.status(201).json({
        message: 'Sala criada com sucesso',
        room,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao criar sala',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const rooms = await Room.find({ isPrivate: false })
        .populate('creator', 'username')
        .populate('participants', 'username isOnline');

      return res.json(rooms);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao listar salas',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const room = await Room.findById(id)
        .populate('creator', 'username')
        .populate('participants', 'username isOnline');

      if (!room) {
        return res.status(404).json({
          message: 'Sala não encontrada',
        });
      }

      return res.json(room);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao buscar sala',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async join(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const room = await Room.findById(id);

      if (!room) {
        return res.status(404).json({
          message: 'Sala não encontrada',
        });
      }

      if (room.participants.includes(new mongoose.Types.ObjectId(userId))) {
        return res.status(400).json({
          message: 'Você já está nesta sala',
        });
      }

      room.participants.push(new mongoose.Types.ObjectId(userId));
      await room.save();

      return res.json({
        message: 'Entrou na sala com sucesso',
        room,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao entrar na sala',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async leave(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const room = await Room.findById(id);

      if (!room) {
        return res.status(404).json({
          message: 'Sala não encontrada',
        });
      }

      if (!room.participants.includes(new mongoose.Types.ObjectId(userId))) {
        return res.status(400).json({
          message: 'Você não está nesta sala',
        });
      }

      room.participants = room.participants.filter(
        (participantId) => participantId.toString() !== userId
      );
      await room.save();

      return res.json({
        message: 'Saiu da sala com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao sair da sala',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
} 