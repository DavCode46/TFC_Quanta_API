import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import ErrorModel from '../models/Error.model.js';
import UserModel from '../models/User.model.js';
import { sendRegistrationEmail } from '../utils/sendEmail.js';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_NUMBER_PATTERN = /^\d{9}$/;



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

    await sendRegistrationEmail(email, process.env.CLIENT_URL)

    return res.status(201).json(`Usuario ${user.email} registrado con éxito`);


  } catch (error) {
    return next(new ErrorModel(error, 422))
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return next(new ErrorModel('Todos los campos son obligatorios', 400))
    }

    const lowerEmail = email.toLowerCase();

    const user = await UserModel.findOne( { email: lowerEmail });
    if(!user) {
      return next(new ErrorModel('Credenciales incorrectas', 400))
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if(!isMatchPassword) {
      return next(new ErrorModel('Credenciales incorrectas', 400));
    }

    const { _id: id, username, email: userEmail, phone} = user
    const token = jwt.sign({ id, username, userEmail, phone  }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return res.status(200).json({
      token,
      id,
      username,
      email,
      phone,
    })
  } catch(error) {
    return next(new ErrorModel(error, 422))
  }
}

export {
  login, register
};

