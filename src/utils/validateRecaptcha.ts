const validateReCaptcha = async (token: string): Promise<boolean> => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
  try {
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();
    return data.success;
  } catch (error) {
    return false;
  }
}

export default validateReCaptcha;
