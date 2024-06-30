import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client'
import generateBcrypt from '../utils/generateBcrypt'
import generateJWT from "../utils/generateJWT"
import { LoginResponse, RegisterForm, toUserResponseDto } from "../types/auth"
import validatePassword from "../utils/validatePassword"

const prisma: PrismaClient = new PrismaClient()

export interface LoginForm {
  emailOrUsername: string
  password: string
}

export const createAccount = async (req: Request<{}, {}, RegisterForm>, res: Response): Promise<any> => {
  const { firstName, lastName, email, username, password } = req.body
  const emailInUse = await prisma.user.findUnique({ where: { email }})
  if (emailInUse) return res.status(400).json({ errors: [{ message: 'El correo electrónico ya está en uso.' }]})
  const usernameInUse = await prisma.user.findUnique({ where: { username }})
  if (usernameInUse) return res.status(400).json({ errors: [{ message: 'El nombre de usuario ya está en uso.' }]})
  const hashedPassword = await generateBcrypt(password)
  const storedUser = await prisma.user.create({ data: { firstName, lastName, email, username, password: hashedPassword }})
  const response: LoginResponse = {
    user: toUserResponseDto(storedUser),
    token: generateJWT(storedUser.id.toString())
  }
  res.status(201).json(response)
}

export const authenticate = async (req: Request<{}, {}, LoginForm>, res: Response): Promise<any> => {
  const { emailOrUsername, password } = req.body
  const user = await prisma.user.findFirst({ where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }]}})
  if (!user) return res.status(404).json({ errors: [{ message: 'El nombre de usuario o correo electrónico no existe.' }]})
  const isValidPassword = await validatePassword(password, user)
  if (!isValidPassword) return res.status(404).json({ errors: [{ message: 'La contraseña es incorrecta.' }]})
  const response: LoginResponse = {
    user: toUserResponseDto(user),
    token: generateJWT(user.id.toString())
  }
  res.status(200).json(response)
}