import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const checkAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'Sem token de autorização' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token inválido!' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;

    next(); // segue para o próximo middleware ou controller
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Acesso negado. Token inválido ou expirado!' });
    return;
  }
};
