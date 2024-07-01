import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { AuthRequest } from '../types/auth';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

const checkAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined = req.headers.authorization?.split(' ')[1];
  try {
    if (!token) {
      throw new Error('Token no proporcionado');
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    req.user = user
    next();
  } catch (error) {
    return res.status(401).json({ errors: [{ message: 'Token no válido' }] });
  }
};

export default checkAuth;
