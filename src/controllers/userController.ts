import { Request, Response } from "express"
import { PrismaClient, User } from '@prisma/client'
import generateBcrypt from '../utils/generateBcrypt'
import generateJWT from "../utils/generateJWT"
import { ForgotForm, ForgotResponse, LoginForm, LoginResponse, RecoveryForm, RecoveryResponse, RegisterForm, ValidateRecoveryHashResponse, toUserResponseDto } from "../types/auth"
import validatePassword from "../utils/validatePassword"
import validateReCaptcha from "../utils/validateRecaptcha"
import sendRecoveryEmail from "../utils/sendRecoveryEmail"
import generateRecoveryHash from "../utils/generateRecoveryHash"

const prisma: PrismaClient = new PrismaClient()

export const createAccount = async (req: Request<{}, {}, RegisterForm>, res: Response): Promise<any> => {
  const { firstName, lastName, email, username, password, reCaptcha } = req.body
  const isValidReCaptcha = await validateReCaptcha(reCaptcha)
  if (!isValidReCaptcha) return res.status(400).json({ errors: [{ message: 'El reCAPTCHA es inválido.' }]})
  const emailInUse = await prisma.user.findUnique({ where: { email }})
  if (emailInUse) return res.status(400).json({ errors: [{ message: 'El correo electrónico ya está en uso.' }]})
  const usernameInUse = await prisma.user.findUnique({ where: { username }})
  if (usernameInUse) return res.status(400).json({ errors: [{ message: 'El nombre de usuario ya está en uso.' }]})
  const hashedPassword = await generateBcrypt(password)
  const storedUser: User = await prisma.user.create({ data: { firstName, lastName, email, username, password: hashedPassword }})
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

export const forgot = async (req: Request<{}, {}, ForgotForm>, res: Response): Promise<any> => {
  const { email } = req.body
  const user = await prisma.user.findUnique({ where: { email }})
  if (!user) return res.status(404).json({ errors: [{ message: 'El correo electrónico no existe.' }]})
  const updatedUser: User = await prisma.user.update({ where: { id: user.id }, data: { recoveryHash: generateRecoveryHash()}})
  const emailSended = await sendRecoveryEmail(updatedUser)
  if (!emailSended) return res.status(500).json({ errors: [{ message: 'No se pudo enviar el correo electrónico.' }]})
  const response: ForgotResponse = { emailSent: true }
  res.status(200).json(response)
}

export const validateRecoverHash = async (req: Request, res: Response): Promise<any> => {
  const { userId, hash } = req.params
  const user = await prisma.user.findUnique({ where: { id: Number(userId) }})
  if (!user) return res.status(404).json({ errors: [{ message: 'El usuario no existe.' }]})
  if (user.recoveryHash !== hash) return res.status(400).json({ errors: [{ message: 'El enlace de recuperación es inválido.' }]})
  const response: ValidateRecoveryHashResponse = { valid: true }
  res.status(200).json(response)
}

export const changePassword = async (req: Request<{}, {}, RecoveryForm>, res: Response): Promise<any> => {
  const { userId, recoveryHash, password } = req.body
  const user = await prisma.user.findUnique({ where: { id: Number(userId) }})
  if (!user) return res.status(404).json({ errors: [{ message: 'El usuario no existe.' }]})
  if (user.recoveryHash !== recoveryHash) return res.status(400).json({ errors: [{ message: 'El enlace de recuperación es inválido.' }]})
  const hashedPassword = await generateBcrypt(password)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword, recoveryHash: null }})
  const response: RecoveryResponse = { passwordChanged: true }
  res.status(200).json(response)
}