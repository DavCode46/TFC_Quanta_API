import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import ErrorModel from '../models/Error.model.js';
import UserModel from '../models/User.model.js';

const PASSWORD_PATTERN = ' /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;'
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

    return res.status(201).json(`Usuario ${username.email} registrado con éxito`);


  } catch (error) {
    return next(new ErrorModel("Registro fallido ", 422))
  }
}
