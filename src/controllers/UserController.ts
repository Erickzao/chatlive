import { Request, Response } from 'express';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRATION) {
  throw new Error('JWT_SECRET e JWT_EXPIRATION devem estar definidos nas variáveis de ambiente');
}

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

export class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Usuário ou email já existe',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION } as SignOptions
      );

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao criar usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: 'Credenciais inválidas',
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Credenciais inválidas',
        });
      }

      user.isOnline = true;
      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION } as SignOptions
      );

      return res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao realizar login',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async getMe(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({
          message: 'Usuário não encontrado',
        });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao obter informações do usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async logout(req: Request & { user?: { userId: string } }, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Não autorizado',
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: 'Usuário não encontrado',
        });
      }

      user.isOnline = false;
      await user.save();

      return res.json({
        message: 'Logout realizado com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao realizar logout',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
} 