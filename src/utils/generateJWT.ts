import jwt from 'jsonwebtoken'

const generateJWT = (id: string): string => {
  console.log(process.env.JWT_SECRET)
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    algorithm: 'HS256',
    expiresIn: '30d'
  })
}

export default generateJWT