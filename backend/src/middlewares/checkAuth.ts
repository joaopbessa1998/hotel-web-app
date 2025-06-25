// backend/src/middlewares/checkAuth.ts
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: 'hospede' | 'hotel';
      userEmail?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

// payload q foi colocado no token
interface JwtPayload {
  userId: string;
  role: 'hospede' | 'hotel';
  iat: number;
  exp: number;
}

/**
 * Middleware:
 *  1. Lê "Authorization: Bearer <token>"
 *  2. Verifica JWT
 *  3. Adiciona userId e role ao req
 */
export const checkAuth: RequestHandler = (req, res, next) => {
  // header presente?
  const hdr = req.header('Authorization');
  if (!hdr?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Sem token de autorização' });
    return;
  }

  const token = hdr.split(' ')[1];

  try {
    // verifica se há JWT
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // injeta no req – tipado via declaration merging
    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch {
    res
      .status(401)
      .json({ message: 'Acesso negado. Token inválido ou expirado!' });
  }
};
