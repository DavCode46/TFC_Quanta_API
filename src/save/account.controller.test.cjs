// import { beforeEach, describe, expect, it, jest } from "@jest/globals";
// import {
//   createAccount,
//   getAccountByUserId,
// } from "../src/controllers/accountController.js";
// import Account from "../src/models/Account.model.js";
// import ErrorModel from "../src/models/Error.model.js";
// import User from "../src/models/User.model.js";
// import generateUniqueIBAN from "../src/utils/generateAccount.js";

// jest.mock("../src/models/User.model.js");
// jest.mock("../src/models/Account.model.js");
// jest.mock("../src/utils/generateAccount.js");

// describe("Account Controller Unit Tests", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = { body: {}, params: {} };
//     res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//     next = jest.fn();
//     jest.clearAllMocks();
//   });

//   describe("createAccount", () => {
//     it("should call next with ErrorModel if user not found", async () => {
//       req.body = { userId: "u1" };
//       User.findById.mockResolvedValue(null);
//       await createAccount(req, res, next);
//       expect(next).toHaveBeenCalledWith(expect.any(ErrorModel));
//     });

//     it("should create account and return 201", async () => {
//       req.body = { userId: "u1" };
//       User.findById.mockResolvedValue({ _id: "u1" });
//       generateUniqueIBAN.mockResolvedValue("IBAN123");
//       Account.mockImplementation(function () {
//         this.save = jest.fn().mockResolvedValue();
//         this.account_number = "IBAN123";
//         this.user = "u1";
//       });

//       await createAccount(req, res, next);

//       expect(generateUniqueIBAN).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Cuenta creada con éxito",
//         account: expect.objectContaining({
//           account_number: "IBAN123",
//           user: "u1",
//         }),
//       });
//     });
//   });

//   describe("getAccountByUserId", () => {
//     it("should return 400 if id missing", async () => {
//       req.params = {};
//       await getAccountByUserId(req, res);
//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("should return 404 if account not found", async () => {
//       req.params = { id: "u2" };
//       Account.findOne.mockResolvedValue(null);
//       await getAccountByUserId(req, res);
//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("should return 200 and account on success", async () => {
//       req.params = { id: "u2" };
//       const acc = { _id: "a1", user: "u2", account_number: "IBAN999" };
//       Account.findOne.mockResolvedValue(acc);
//       await getAccountByUserId(req, res);
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Cuenta obtenida con éxito",
//         account: acc,
//       });
//     });
//   });
// });
