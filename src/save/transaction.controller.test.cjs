// import { beforeEach, describe, expect, it, jest } from "@jest/globals";
// import {
//   addMoney,
//   getTransactionsByUser,
//   transferMoney,
//   withdrawMoney,
// } from "../src/controllers/transactionController.js";
// import Account from "../src/models/Account.model.js";
// import Transaction from "../src/models/Transaction.model.js";
// import User from "../src/models/User.model.js";

// jest.mock("../src/models/Account.model.js");
// jest.mock("../src/models/Transaction.model.js");
// jest.mock("../src/models/User.model.js");

// describe("Transaction Controller Unit Tests", () => {
//   let req, res;

//   beforeEach(() => {
//     req = { body: {}, params: {} };
//     res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//     jest.clearAllMocks();
//   });

//   describe("addMoney", () => {
//     it("returns 400 if fields missing", async () => {
//       await addMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("returns 400 if amount <= 0", async () => {
//       req.body = { amount: 0, account_number: "IBAN" };
//       await addMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("returns 404 if account not found", async () => {
//       req.body = { amount: 50, account_number: "IBAN" };
//       Account.findOne.mockResolvedValue(null);
//       await addMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("adds money and creates transaction", async () => {
//       const acc = { balance: 100, save: jest.fn() };
//       req.body = { amount: 50, account_number: "IBAN" };
//       Account.findOne.mockResolvedValue(acc);
//       Transaction.mockImplementation(function () {
//         this.save = jest.fn().mockResolvedValue();
//       });

//       await addMoney(req, res);
//       expect(acc.balance).toBe(150);
//       expect(acc.save).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ message: "Transacción realizada con éxito" })
//       );
//     });
//   });

//   describe("withdrawMoney", () => {
//     it("returns 400 if fields missing", async () => {
//       await withdrawMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("returns 400 if amount <= 0", async () => {
//       req.body = { amount: 0, account_number: "IBAN" };
//       await withdrawMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("returns 400 if insufficient balance", async () => {
//       const acc = { balance: 20 };
//       req.body = { amount: 50, account_number: "IBAN" };
//       Account.findOne.mockResolvedValue(acc);
//       await withdrawMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("withdraws money and creates transaction", async () => {
//       const acc = { balance: 100, save: jest.fn() };
//       req.body = { amount: 30, account_number: "IBAN" };
//       Account.findOne.mockResolvedValue(acc);
//       Transaction.mockImplementation(function () {
//         this.save = jest.fn().mockResolvedValue();
//       });

//       await withdrawMoney(req, res);
//       expect(acc.balance).toBe(70);
//       expect(acc.save).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ message: "Transacción realizada con éxito" })
//       );
//     });
//   });

//   describe("transferMoney", () => {
//     it("returns 400 if fields missing", async () => {
//       await transferMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("returns 400 if amount <= 0", async () => {
//       req.body = { amount: 0, origin_account: "OA", destination_account: "DA" };
//       await transferMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("returns 404 if origin account not found", async () => {
//       req.body = {
//         amount: 50,
//         origin_account: "OA",
//         destination_account: "DA",
//       };
//       Account.findOne.mockResolvedValueOnce(null);
//       await transferMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("returns 404 if destination account not found", async () => {
//       req.body = {
//         amount: 50,
//         origin_account: "OA",
//         destination_account: "DA",
//       };
//       Account.findOne
//         .mockResolvedValueOnce({ balance: 100 })
//         .mockResolvedValueOnce(null);
//       await transferMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("returns 400 if insufficient funds", async () => {
//       const oa = { balance: 30 };
//       req.body = {
//         amount: 50,
//         origin_account: "OA",
//         destination_account: "DA",
//       };
//       Account.findOne
//         .mockResolvedValueOnce(oa)
//         .mockResolvedValueOnce({ balance: 0 });
//       await transferMoney(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("transfers money and records transaction", async () => {
//       const oa = { balance: 100, save: jest.fn() };
//       const da = { balance: 0, save: jest.fn() };
//       req.body = {
//         amount: 50,
//         origin_account: "OA",
//         destination_account: "DA",
//       };
//       Account.findOne.mockResolvedValueOnce(oa).mockResolvedValueOnce(da);
//       Transaction.mockImplementation(function () {
//         this.save = jest.fn().mockResolvedValue();
//       });

//       await transferMoney(req, res);
//       expect(oa.balance).toBe(50);
//       expect(da.balance).toBe(50);
//       expect(oa.save).toHaveBeenCalled();
//       expect(da.save).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ message: "Transacción realizada con éxito" })
//       );
//     });
//   });

//   describe("getTransactionsByUser", () => {
//     it("returns 400 if email missing", async () => {
//       await getTransactionsByUser(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("returns 404 if user not found", async () => {
//       req.params = { email: "test@ex.com" };
//       User.findOne.mockResolvedValue(null);
//       await getTransactionsByUser(req, res);
//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("returns 404 if account not found", async () => {
//       req.params = { email: "test@ex.com" };
//       User.findOne.mockResolvedValue({ _id: "u1" });
//       Account.findOne.mockResolvedValue(null);
//       await getTransactionsByUser(req, res);
//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("returns empty list if no transactions", async () => {
//       req.params = { email: "test@ex.com" };
//       User.findOne.mockResolvedValue({ _id: "u1" });
//       Account.findOne.mockResolvedValue({ _id: "a1" });
//       Transaction.find.mockResolvedValue([]);
//       await getTransactionsByUser(req, res);
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "No se encontraron transacciones",
//         transactions: [],
//       });
//     });

//     it("returns transactions on success", async () => {
//       req.params = { email: "test@ex.com" };
//       const txs = [{ _id: "t1" }];
//       User.findOne.mockResolvedValue({ _id: "u1" });
//       Account.findOne.mockResolvedValue({ _id: "a1" });
//       Transaction.find.mockResolvedValue(txs);
//       await getTransactionsByUser(req, res);
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Transacciones obtenidas con éxito",
//         transactions: txs,
//       });
//     });
//   });
// });
