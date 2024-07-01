import { User } from '@prisma/client'
import bcrypt from 'bcrypt'

const validatePassword = async (password: string, user: User): Promise<boolean> => {
  return await bcrypt.compare(password, user.password)
}

export default validatePassword