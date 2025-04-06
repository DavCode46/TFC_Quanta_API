import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import ErrorModel from '../models/Error.model.js';
import UserModel from '../models/User.model.js';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_NUMBER_PATTERN = /^\d{9}$/;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

/*
  REGISTER A USER
  POST --> /api/users/register

  UNPROTECTED ROUTE
*/

const register = async (req, res, next) => {
  console.log('Body', req.body)
  try {
    const { username, email, phone, password, confirmPassword } = req.body;
    if (!username || !email || !phone || !password || !confirmPassword) {
      return next(new ErrorModel('Todos los campos son obligatorios', 422))
    }

    const lowerEmail = email.toLowerCase();

    const emailExists = await UserModel.findOne({ email: lowerEmail });
    if (emailExists) {
      return next(new ErrorModel('El correo ya está registrado', 400))
    }

    if (!PHONE_NUMBER_PATTERN.test(phone)) {
      return next(new ErrorModel('El número de teléfono no es válido', 400))
    }

    if (!PASSWORD_PATTERN.test(password)) {
      return next(new ErrorModel('La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una minúscula y un caracter especial', 400))
    }

    if (password != confirmPassword) {
      return next(new ErrorModel('Las contraseñas no coinciden', 400))
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      username: username,
      email: lowerEmail,
      password: hashedPassword,
      phone: phone,
    })

    await user.save();

    /*
      TO DO: SEND REGISTRATION EMAIL
    */
      transporter.sendMail({
        from: "davidblanco1993@gmail.com",
        to: email,
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
                    <a class="button" style="color: white;" href=${process.env.CLIENT_URL}>Iniciar sesión</a>
                </div>
            </div>
        </body>
        </html>
        `,
      });

    return res.status(201).json(`Usuario ${user.email} registrado con éxito`);


  } catch (error) {
    return next(new ErrorModel(error, 422))
  }
}

export {
  register
};

