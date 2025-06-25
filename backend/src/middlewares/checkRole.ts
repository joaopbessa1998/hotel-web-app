// middlewares/checkRole.ts
import { RequestHandler } from 'express';

export const checkRole = (allowedRoles: string[]): RequestHandler => {
  return (req, res, next): void => {
    const userRole = (req as any).role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ message: 'Acesso negado. Role não permitido.' });
      return; // aqui garante-se que a função termina, mas retorna `void`
    }

    next();
  };
};
