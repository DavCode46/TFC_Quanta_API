import Account from '../models/Account.model.js';


const generateAccountNumber = () => {
  const bank = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const sucursal = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const dc = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const account = String(Math.floor(Math.random() * 10000000000)).padStart(10, '0');

  const ccc = `${bank}${sucursal}${dc}${account}`;

  const iban = String(Math.floor(Math.random() * 90) + 10);

  return `ES${iban}${ccc}`;
};


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
