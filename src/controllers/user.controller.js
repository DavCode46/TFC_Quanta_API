import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AccountModel from "../models/Account.model.js";
import UserModel from "../models/User.model.js";
import generateUniqueIBAN from "../utils/generateAccount.js";
import { sendRegistrationEmail } from "../utils/sendEmail.js";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_NUMBER_PATTERN = /^\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
  REGISTER A USER
  POST --> /api/users/register

  UNPROTECTED ROUTE
*/

const register = async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword } = req.body;
    if (!username || !email || !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: "El correo no es válido" });
    }

    const lowerEmail = email.toLowerCase();

    const emailExists = await UserModel.findOne({ email: lowerEmail });
    if (emailExists) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    if (!PHONE_NUMBER_PATTERN.test(phone)) {
      return res
        .status(400)
        .json({ error: "El número de teléfono no es válido" });
    }

    if (!PASSWORD_PATTERN.test(password)) {
      return res.status(400).json({
        error:
          "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una minúscula y un caracter especial",
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      username: username,
      email: lowerEmail,
      password: hashedPassword,
      phone: phone,
    });

    await user.save();

    const savedUser = await UserModel.findOne({ email: lowerEmail });

    const randomAccountNumber = await generateUniqueIBAN();

    const newAccount = new AccountModel({
      user: savedUser._id,
      account_number: randomAccountNumber,
    });

    await newAccount.save();

    // await sendRegistrationEmail(email, process.env.CLIENT_URL)

    return res
      .status(201)
      .json(
        `Usuario ${user.email} registrado con éxito y cuenta creada con número ${newAccount.account_number}`
      );
  } catch (error) {
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const lowerEmail = email.toLowerCase();

    const user = await UserModel.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }

    const { _id: id, username, email: userEmail, phone } = user;
    const token = jwt.sign(
      { id, username, userEmail, phone },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      token,
      id,
      username,
      email,
      phone,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { userId, phone, email, currentPassword, newPassword } = req.body;
    console.log(req.body);

    if (phone && !PHONE_NUMBER_PATTERN.test(phone)) {
      return res
        .status(400)
        .json({ error: "El número de teléfono no es válido" });
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: "El correo no es válido" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Credenciales incorrectas" });
    }

    const emailExists = await UserModel.findOne({ email: email }).select(
      "-password"
    );
    if (emailExists && emailExists._id.toString() !== userId) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const isMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isMatched) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }

    const updateFields = {
      phone,
      email,
    };

    if (newPassword) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const {
      _id: id,
      username,
      email: userEmail,
      phone: phoneNumber,
    } = updatedUser;

    const token = jwt.sign(
      {
        id,
        username,
        userEmail,
        phoneNumber,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      token,
      id,
      username,
      email: userEmail,
      phone: phoneNumber,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "El correo es obligatorio" });
    }
    const lowerEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: lowerEmail }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

export { getUserByEmail, login, register, updateUserInfo };
