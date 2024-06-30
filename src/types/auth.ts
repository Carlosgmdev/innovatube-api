export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string
  password: string
}

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
}

export interface LoginResponse {
  user: UserResponseDto
  token: string
}

