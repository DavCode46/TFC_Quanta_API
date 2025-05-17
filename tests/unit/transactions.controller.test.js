import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  addMoney,
  getTransactionsByUser,
  transferMoney,
  withdrawMoney,
} from "../../src/controllers/transaction.controller.js";
import Account from "../../src/models/Account.model.js";
import Transaction from "../../src/models/Transaction.model.js";
import User from "../../src/models/User.model.js";

let mongoServer;
let userCounter = 0;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  jest.clearAllMocks();
  await User.deleteMany({});
  await Account.deleteMany({});
  await Transaction.deleteMany({});
  userCounter = 0;
});

const createValidUser = async (userData = {}) => {
  userCounter++;
  return await User.create({
    username: `user${userCounter}`,
    email: `user${userCounter}@test.com`,
    phone: `12345678${userCounter.toString().padStart(2, "0")}`,
    password: "password",
    ...userData,
  });
};
describe("Transaction Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("addMoney()", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = {};
      await addMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todos los campos son requeridos",
      });
    });

    it("should return 400 if amount is invalid (when fields are present)", async () => {
      req.body = {
        amount: 0,
        account_number: "ES8990854490304444579247",
      };
      await addMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todos los campos son requeridos",
      });
    });

    it("should return 404 if account doesn't exist", async () => {
      req.body = { amount: 100, account_number: "ES8990854490304444579248" };
      await addMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "La cuenta no existe",
      });
    });

    it("should add money to account and create transaction", async () => {
      const user = await createValidUser();
      const account = await Account.create({
        user: user._id,
        account_number: "ES8990854490304444579247",
        balance: 1000,
      });

      req.body = { amount: 500, account_number: "ES8990854490304444579247" };
      await addMoney(req, res);

      const updatedAccount = await Account.findById(account._id);
      const transaction = await Transaction.findOne({
        destination_account: account._id,
      });

      expect(updatedAccount.balance).toBe(1500);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transacción realizada con éxito",
        transaction: expect.objectContaining({
          type: "ingreso",
          amount: 500,
        }),
      });
      expect(transaction).not.toBeNull();
    });
  });

  describe("withdrawMoney()", () => {
    it("should return 400 if required fields are missing", async () => {
      await withdrawMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todos los campos son obligatorios",
      });
    });

    it("should return 400 if amount is 0 or negative", async () => {
      req.body = { amount: -100, account_number: "ES8990854490304444579247" };
      await withdrawMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "La cantidad debe ser mayor que 0",
      });
    });

    it("should return 404 if account doesn't exist", async () => {
      req.body = { amount: 100, account_number: "ES8990854490304444579248" };
      await withdrawMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "La cuenta no existe",
      });
    });

    it("should withdraw money and create transaction", async () => {
      const user = await createValidUser();
      const account = await Account.create({
        user: user._id,
        account_number: "ES8990854490304444579247",
        balance: 1000,
      });

      req.body = { amount: 500, account_number: "ES8990854490304444579247" };
      await withdrawMoney(req, res);

      const updatedAccount = await Account.findById(account._id);
      const transaction = await Transaction.findOne({
        origin_account: account._id,
      });

      expect(updatedAccount.balance).toBe(500);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transacción realizada con éxito",
        transaction: expect.objectContaining({
          type: "retirada",
          amount: 500,
        }),
      });
      expect(transaction).not.toBeNull();
    });
  });

  describe("transferMoney()", () => {
    it("should return 400 if required fields are missing", async () => {
      await transferMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todos los campos son obligatorios",
      });
    });

    it("should return 400 if amount is invalid (when fields are present)", async () => {
      req.body = {
        amount: 0,
        origin_account: "ES8990854490304444579247",
        destination_account: "ES8990854490304444579248",
      };
      await transferMoney(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todos los campos son obligatorios",
      });
    });

    it("should return 400 if insufficient balance", async () => {
      const user1 = await createValidUser();
      const user2 = await createValidUser();

      await Account.create({
        user: user1._id,
        account_number: "ES8990854490304444579247",
        balance: 100,
      });
      await Account.create({
        user: user2._id,
        account_number: "ES8990854490304444579248",
        balance: 500,
      });

      req.body = {
        amount: 500,
        origin_account: "ES8990854490304444579247",
        destination_account: "ES8990854490304444579248",
      };
      await transferMoney(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Saldo insuficiente",
      });
    });

    it("should transfer money and create transaction", async () => {
      const user1 = await createValidUser();
      const user2 = await createValidUser();

      const originAccount = await Account.create({
        user: user1._id,
        account_number: "ES8990854490304444579247",
        balance: 1000,
      });
      const destAccount = await Account.create({
        user: user2._id,
        account_number: "ES8990854490304444579248",
        balance: 500,
      });

      req.body = {
        amount: 300,
        origin_account: "ES8990854490304444579247",
        destination_account: "ES8990854490304444579248",
      };
      await transferMoney(req, res);

      const updatedOrigin = await Account.findById(originAccount._id);
      const updatedDest = await Account.findById(destAccount._id);
      const transaction = await Transaction.findOne({
        origin_account: originAccount._id,
        destination_account: destAccount._id,
      });

      expect(updatedOrigin.balance).toBe(700);
      expect(updatedDest.balance).toBe(800);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transacción realizada con éxito",
        transaction: expect.objectContaining({
          type: "transferencia",
          amount: 300,
        }),
      });
      expect(transaction).not.toBeNull();
    });
  });

  describe("getTransactionsByUser()", () => {
    it("should return 400 if email is missing", async () => {
      await getTransactionsByUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El email es requerido",
      });
    });

    it("should return 404 if user doesn't exist", async () => {
      req.params = { email: "nonexistent@test.com" };
      await getTransactionsByUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "El usuario no existe",
      });
    });

    it("should return 404 if account doesn't exist", async () => {
      await createValidUser();
      req.params = { email: "test@example.com" };
      await getTransactionsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "El usuario no existe",
      });
    });

    it("should return user transactions", async () => {
      const user1 = await createValidUser({ email: "user1@test.com" });
      const user2 = await createValidUser({ email: "user2@test.com" });

      const account1 = await Account.create({
        user: user1._id,
        account_number: "ES1234",
        balance: 1000,
      });
      const account2 = await Account.create({
        user: user2._id,
        account_number: "ES5678",
        balance: 500,
      });

      await Transaction.create([
        {
          origin_account: account1._id,
          destination_account: account2._id,
          type: "transferencia",
          amount: 200,
        },
        {
          destination_account: account1._id,
          type: "ingreso",
          amount: 500,
        },
        {
          origin_account: account1._id,
          type: "retirada",
          amount: 100,
        },
      ]);

      req.params = { email: "user1@test.com" };
      await getTransactionsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transacciones obtenidas con éxito",
        transactions: expect.arrayContaining([
          expect.objectContaining({ type: "transferencia" }),
          expect.objectContaining({ type: "ingreso" }),
          expect.objectContaining({ type: "retirada" }),
        ]),
      });
    });
  });
});
