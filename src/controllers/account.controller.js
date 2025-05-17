import Account from "../models/Account.model.js";
import User from "../models/User.model.js";
import generateUniqueIBAN from "../utils/generateAccount.js";

const createAccount = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "El usuario no existe",
      });
    }

    const randomAccountNumber = await generateUniqueIBAN();

    const newAccount = new Account({
      user: userId,
      account_number: randomAccountNumber,
    });

    await newAccount.save();

    return res.status(201).json({
      message: "Cuenta creada con éxito",
      account: newAccount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear la cuenta" });
  }
};

const getAccountByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("userId", id);
    if (!id) {
      return res.status(400).json({ error: "El id de usuario es obligatorio" });
    }

    const account = await Account.findOne({ user: id });
    console.log(account);

    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    return res.status(200).json({
      message: "Cuenta obtenida con éxito",
      account,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener la cuenta" });
  }
};

export { createAccount, getAccountByUserId };
