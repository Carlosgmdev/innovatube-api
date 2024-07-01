
const generateRecoveryHash = (): string => {
  const date = new Date()
  const timestamp = date.getTime()
  const random = Math.random().toString(36).substring(2)
  return `${timestamp}${random}`
}

export default generateRecoveryHash