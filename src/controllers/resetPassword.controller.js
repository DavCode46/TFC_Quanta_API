import bcrypt from "bcryptjs";
import PasswordResetCode from "../models/ResetPassword.model.js";
import User from "../models/User.model.js";
import { sendResetPasswordEmail } from "../utils/sendEmail.js";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerEmail });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado." });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await PasswordResetCode.findOneAndUpdate(
      { userId: user._id },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    await sendResetPasswordEmail(email, code);

    res.status(200).json({
      message: "Código de restablecimiento de contraseña enviado a tu correo.",
    });
  } catch (error) {
    console.error("Error al enviar el código:", error);
    res.status(500).json({ error: "Error al enviar el código" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerEmail });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado." });

    const record = await PasswordResetCode.findOne({ userId: user._id, code });
    if (!record) {
      return res.status(400).json({ error: "Código incorrecto." });
    }
    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Código expirado." });
    }
    if (!PASSWORD_PATTERN.test(newPassword)) {
      return res.status(400).json({
        error:
          "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una minúscula y un caracter especial",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    await record.deleteOne();

    res.status(200).json({ message: "Contraseña restablecida correctamente." });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
};

export { resetPassword, sendCode };
