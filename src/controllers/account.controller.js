import Account from '../models/Account.model.js';
import ErrorModel from '../models/Error.model.js';
import User from '../models/User.model.js';
import generateUniqueIBAN from '../utils/generateAccount.js';

const createAccount = async (req, res, next) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId);
    if(!user) {
      return next(new ErrorModel('El usuario no existe', 404))
    }

    const randomAccountNumber = await generateUniqueIBAN();

    const newAccount = new Account({
      user: userId,
      account_number: randomAccountNumber
    })

    await newAccount.save();

    return res.status(201).json({
      message: 'Cuenta creada con éxito',
      account: newAccount
    })
  }catch(error) {
    console.error(error)
    return next(new ErrorModel('Error al crear la cuenta', 500))
  }
}

const deleteAccount = async (req, res, next) => {
  try {
    const { accountNumber } = req.body;

    const account = await Account.findOne( { account_number: accountNumber });

    if(!account) {
      return next(new ErrorModel('La cuenta no existe', 404));
    }

    await account.deleteOne();
    return res.status(200).json({
      message: 'Cuenta eliminada con éxito'
    })
  }catch(error){
    console.error(error)
    return next(new ErrorModel('Error al eliminar la cuenta', 500))
  }
}

export {
  createAccount,
  deleteAccount
};

