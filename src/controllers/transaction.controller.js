import Account from '../models/Account.model.js';
import ErrorModel from '../models/Error.model.js';
import Transaction from '../models/Transaction.model.js';


const addMoney = async (req, res, next) => {

  try{
    console.log('Body', req.body)
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

export {
  addMoney
};

