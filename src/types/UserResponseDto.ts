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

