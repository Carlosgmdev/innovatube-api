import { User } from "@prisma/client";
import { MailDataRequired, MailService } from "@sendgrid/mail";

const sendRecoveryEmail = async (user: User): Promise<boolean> => {
  const { id, email, recoveryHash } = user;
  const mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY as string);
  const recoveryLink = `${process.env.FRONTEND_URL}/recovery/${id}/${recoveryHash}`;
  const msg: MailDataRequired = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL as string,
    subject: "Recuperación de contraseña",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de contraseña</title>
      </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <h1 style="font-size: 24px; color: #333333;">Recuperación de contraseña</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 30px; font-size: 16px; color: #666666;">
                        <p style="margin: 0 0 20px 0;">Para recuperar tu contraseña, haz clic en el siguiente enlace:</p>
                        <a href="${recoveryLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Recuperar contraseña</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px 30px 0 30px; font-size: 14px; color: #999999;">
                        <p style="margin: 0;">Si no solicitaste este cambio, puedes ignorar este correo electrónico.</p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 0; color: #999999; font-size: 12px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} InnovaTube. Todos los derechos reservados.</p>
                    </td>
                </tr>
            </table>
        </body>
      </html>
    `,
  };
  try {
    const res = await mailService.send(msg);
    return res[0].statusCode === 202;
  } catch (error) {
    return false;
  }
};

export default sendRecoveryEmail;
