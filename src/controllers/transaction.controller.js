import Account from '../models/Account.model.js';
import ErrorModel from '../models/Error.model.js';
import Transaction from '../models/Transaction.model.js';



const addMoney = async (req, res, next) => {

  try{

    const { id, amount, account_number } = req.body

    if(!id || !amount || !account_number) {
      return next(new ErrorModel('Faltan datos', 400));
    }
    if(amount <= 0) {
      return next(new ErrorModel('La cantidad debe ser mayor que 0', 400));
    }

      const account = await Account.findOne( { account_number: account_number});

      if(!account) {
        return next(new ErrorModel('La cuenta no existe', 404));
      }

      account.balance += amount;

      await account.save();
      const transaction = new Transaction({
        destination_account: account._id,
        type: 'ingreso',
        amount: amount
      })

      await transaction.save();

      return res.status(200).json({
          message: 'Transacción realizada con éxito',
          transaction: transaction
      })
  }catch(error) {
    console.error(error);
    return next(new ErrorModel(error, 500));
  }

}


const withdrawMoney = async (req, res, next) => {

  try{

    const { id, amount, account_number } = req.body

    if(!id || !amount || !account_number) {
      return next(new ErrorModel('Faltan datos', 400));
    }
    if(amount <= 0) {
      return next(new ErrorModel('La cantidad debe ser mayor que 0', 400));
    }

      const account = await Account.findOne( { account_number: account_number});

      if(account.balance < amount) {
        return next(new ErrorModel('Saldo insuficiente', 400));
      }

      if(!account) {
        return next(new ErrorModel('La cuenta no existe', 404));
      }

      account.balance -= amount;

      await account.save();
      const transaction = new Transaction({
        origin_account: account._id,
        type: 'retirada',
        amount: amount
      })

      await transaction.save();

      return res.status(200).json({
          message: 'Transacción realizada con éxito',
          transaction: transaction
      })
  }catch(error) {
    console.error(error);
    return next(new ErrorModel(error, 500));
  }
}


const transferMoney = async (req, res, next) => {

  try{

    const { id, amount, origin_account, destination_account } = req.body


    if(!id || !amount || !origin_account || !destination_account) {
      return next(new ErrorModel('Faltan datos', 400));
    }
    if(amount <= 0) {
      return next(new ErrorModel('La cantidad debe ser mayor que 0', 400));
    }

      const originAccount = await Account.findOne( { account_number: origin_account});
      const destinationAccount = await Account.findOne( { account_number: destination_account});
      if(!originAccount) {
        return next(new ErrorModel('La cuenta de origen no existe', 404));
      }
      if(!destinationAccount) {
        return next(new ErrorModel('La cuenta de destino no existe', 404));
      }
      if(originAccount.balance < amount) {
        return next(new ErrorModel('Saldo insuficiente', 400));
      }
      originAccount.balance -= amount;

      destinationAccount.balance += amount;

      await originAccount.save();

      await destinationAccount.save();

      const transaction = new Transaction({
        destination_account: destinationAccount._id,
        origin_account: originAccount._id,
        type: 'transferencia',
        amount: amount
      })

      await transaction.save();

      return res.status(200).json({
          message: 'Transacción realizada con éxito',
          transaction: transaction
      })
  }catch(error) {
    console.error(error);
    return next(new ErrorModel(error, 500));
  }

}


export {
  addMoney, transferMoney, withdrawMoney
};

