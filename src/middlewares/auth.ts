import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
}

const JWT_SECRET = process.env.JWT_SECRET as Secret;

export const authMiddleware = (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction): void | Response => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Token mal formatado' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ message: 'Token mal formatado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    return res.status(500).json({ message: 'Erro ao verificar token' });
  }
}; 