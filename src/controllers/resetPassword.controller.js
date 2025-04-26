import bcrypt from "bcryptjs";
import PasswordResetCode from "../models/ResetPassword.model.js";
import User from "../models/User.model.js";
import { sendResetPasswordEmail } from "../utils/sendEmail.js";

const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(204);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await PasswordResetCode.findOneAndUpdate(
      { userId: user._id },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    await sendResetPasswordEmail(email, code);

    res.sendStatus(204);
  } catch (error) {
    console.error("Error al enviar el código:", error);
    res.status(500).json({ error: "Error al enviar el código" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado." });

    const record = await PasswordResetCode.findOne({ userId: user._id, code });
    if (!record) {
      return res.status(400).json({ message: "Código inválido." });
    }
    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Código expirado." });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    await record.deleteOne();

    res.json({ message: "Contraseña restablecida correctamente." });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
};

export { resetPassword, sendCode };
