import { User } from "@prisma/client";
import { Request } from "express";

export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string
}

export const toUserResponseDto = (user: User): UserResponseDto => {
  const { id, firstName, lastName, username, email } = user
  return { id, firstName, lastName, username, email }
}

export interface LoginForm {
  emailOrUsername: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  username: string
  reCaptcha: string
}

export interface LoginResponse {
  user: UserResponseDto
  token: string
}

export interface ForgotForm {
  email: string
}

export interface ForgotResponse {
  emailSent: boolean
}

export interface ValidateRecoverHashForm {
  userId: string
  recoveryHash: string
}

export interface ValidateRecoveryHashResponse {
  valid: boolean
}

export interface RecoveryForm {
  userId: string
  recoveryHash: string
  password: string
}

export interface RecoveryResponse {
  passwordChanged: boolean
}

export interface AuthRequest<T = {}, U = {}, V = {}> extends Request<T, U, V> {
  user?: User; 
}



