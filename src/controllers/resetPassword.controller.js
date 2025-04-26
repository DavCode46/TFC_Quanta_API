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

export { sendCode };
