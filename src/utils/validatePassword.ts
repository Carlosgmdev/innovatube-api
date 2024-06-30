import bcrypt from 'bcrypt'
import { User } from '../types/auth'

const validatePassword = async (password: string, user: User): Promise<boolean> => {
  return await bcrypt.compare(password, user.password)
}

export default validatePassword