
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendRegistrationEmail = async (to, clientUrl) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: to,
    subject: "¡Registro Quanta!",
    html: `<!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Registro exitoso!</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        color: #6431ee;
        text-align: center;
    }
    p {
        color: #555;
        text-align: center;
        margin-bottom: 20px;
    }
    .button {
        display: inline-block;
        background-color: #6431ee;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
        transition: background-color 0.3s ease;
    }
    .button:hover {
        background-color:rgb(78, 38, 189);
    }
    </style>
    </head>
    <body>
        <div class="container">
            <h1>¡Registro exitoso!</h1>
            <p>Gracias por registrarte. Te has registrado exitosamente en Quanta.</p>
            <p>Por favor, haz clic en el botón a continuación para iniciar sesión:</p>
            <div style="text-align: center;">
                <a class="button" style="color: white;" href=${clientUrl}>Iniciar sesión</a>
            </div>
        </div>
    </body>
    </html>
    `,
  });
}
