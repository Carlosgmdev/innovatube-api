import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client'
import generateBcrypt from '../utils/generateBcrypt'
import { toUserResponseDto } from "../types/UserResponseDto"

const prisma: PrismaClient = new PrismaClient()

export const createAccount = async (req: Request, res: Response): Promise<any> => {
  console.log(req.body)
  const { firstName, lastName, email, username, password } = req.body
  const emailInUse = await prisma.user.findUnique({ where: { email }})
  if (emailInUse) return res.status(400).json({ errors: [{ message: 'El correo electrónico ya está en uso.' }]})
  const usernameInUse = await prisma.user.findUnique({ where: { username }})
  if (usernameInUse) return res.status(400).json({ errors: [{ message: 'El nombre de usuario ya está en uso.' }]})
  const hashedPassword = await generateBcrypt(password)
  const storedUser = await prisma.user.create({ data: { firstName, lastName, email, username, password: hashedPassword }})
  res.status(201).json(toUserResponseDto(storedUser))
}