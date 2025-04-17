import Account from '../models/Account.model.js';
import ErrorModel from '../models/Error.model.js';
import Transaction from '../models/Transaction.model.js';
import User from '../models/User.model.js';



const addMoney = async (req, res, next) => {

  try{

    const { amount, account_number } = req.body


    if(!amount || !account_number) {
      return res.status(400).json({error: 'Todos los campos son requeridos'})
    }
    if(amount <= 0) {
      return res.status(400).json({error: 'La cantidad debe ser mayor que 0'})
    }

      const account = await Account.findOne( { account_number: account_number});

      if(!account) {
        return res.status(404).json({error: 'La cuenta no existe'})
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
    return res.status(500).json({error: 'Error al ingresar dinero'})
  }

}


const withdrawMoney = async (req, res, next) => {

  try{

    const {  amount, account_number } = req.body

    if(!amount || !account_number) {
      return res.status(400).json({error: 'Todos los campos son obligatorios'})
    }
    if(amount <= 0) {
      return res.status(400).json({error: 'La cantidad debe ser mayor que 0'})
    }

      const account = await Account.findOne( { account_number: account_number});

      if(account.balance < amount) {
        return res.status(400).json({error: 'Saldo insuficiente'})
      }

      if(!account) {
        return res.status(404).json({error: 'La cuenta no existe'})
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
    return res.status(500).json({error: 'Ha ocurrido un error al retirar dinero'})
  }
}


const transferMoney = async (req, res, next) => {

  try{

    const { amount, origin_account, destination_account } = req.body


    if(!amount || !origin_account || !destination_account) {
      return res.status(400).json({error: 'Todos los campos son obligatorios'})
    }
    if(amount <= 0) {
      return res.status(400).json({error: 'La cantidad debe ser mayor que 0'})
    }

      const originAccount = await Account.findOne( { account_number: origin_account});
      const destinationAccount = await Account.findOne( { account_number: destination_account});
      if(!originAccount) {
        return res.status(404).json({error: 'La cuenta de origen no existe'})
      }
      if(!destinationAccount) {
        return res.status(404).json({error: 'La cuenta de destino no existe'})
      }
      if(originAccount.balance < amount) {
        return res.status(400).json({error: 'Saldo insuficiente'})
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
    return res.status(500).json({error: 'Ha ocurrido un error al realizar la transferencia'})
  }

}

const getTransactionsByUser = async (req, res, next) => {
  try{
      const { email } = req.params;

      if(!email) {
        return res.status(400).json({error: 'El email es requerido'})
      }

      const lowerEmail = email.toLowerCase();

      const user = await User.findOne( { email: lowerEmail }).select('-password')



      if(!user) {
        return res.status(404).json({error: 'El usuario no existe'})
      }

      const account = await Account.findOne({ user: user._id });


      if(!account) {
        return res.status(404).json({error: 'La cuenta no existe'})
      }

      const transactions = await Transaction.find({
          $or: [
            { origin_account: account._id },
            { destination_account: account._id }
          ]
        }).populate('origin_account')
        .populate('destination_account')

        if (!transactions || transactions.length === 0) {
          return res.status(200).json({
            message: 'No se encontraron transacciones',
            transactions: []
          });
        }


      return res.status(200).json({
          message: 'Transacciones obtenidas con éxito',
          transactions: transactions
      })
  } catch(error) {

    return res.status(500).json({
      error: 'Error al obtener las transacciones',
    })
  }
}


export {
  addMoney, getTransactionsByUser, transferMoney, withdrawMoney
};

