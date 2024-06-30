import bcrypt from 'bcrypt'

const generateBcrypt = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export default generateBcrypt