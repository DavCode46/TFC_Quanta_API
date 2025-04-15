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
    const { accountNumber, userId } = req.body;

    const account = await Account.findOne( { account_number: accountNumber });
    console.log(`Account: ${account}`)
    console.log(`{User}: ${userId} - {Account}: ${accountNumber}`)


    if(userId.toString() !== account.user.toString()) {
      return next(new ErrorModel('No tienes permiso para eliminar esta cuenta', 403));
    }

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

const getAccountByUserId = async (req, res, next) => {
  try{
    const { userId } = req.body;

    const account = await Account.findOne( { user: userId });

    if(!account) {
      return res.status(404).json({error: 'Cuenta no encontrada'})
    }

    return res.status(200).json({
      message: 'Cuenta obtenida con éxito',
      account
    })
  }catch(error) {
    console.error(error)
    return res.status(500).json({error: 'Error al obtener la cuenta'})
  }
}

export {
  createAccount,
  deleteAccount,
  getAccountByUserId
};

