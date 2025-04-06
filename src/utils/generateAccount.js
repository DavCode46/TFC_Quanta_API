import Account from '../models/Account.model.js';


const generateAccountNumber = () => {
  const banco = String(Math.floor(Math.random() * 9999) + 1000);
  const sucursal = String(Math.floor(Math.random() * 9999) + 1000);
  const cuenta = String(Math.floor(Math.random() * 9999999999) + 1000000000);

  const numeroCuenta = `ES${Math.floor(Math.random() * 99) + 10} ${banco} ${sucursal} ${cuenta}`;
  return numeroCuenta;
}

const generateUniqueIBAN = async () => {
  let iban = generateAccountNumber();
  let existingAccount = await Account.findOne({ account_number: iban });

  while(existingAccount) {
    iban = generateAccountNumber();
    existingAccount = await Account.findOne({ account_number: iban });
  }
  return iban;
}

export default generateUniqueIBAN;
