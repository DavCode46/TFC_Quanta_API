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
  createAccount,
  getAccountByUserId,
} from "../../src/controllers/account.controller.js";
import AccountModel from "../../src/models/Account.model.js";
import UserModel from "../../src/models/User.model.js";

process.env.NODE_ENV = "test";

let mongoServer;

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
  await UserModel.deleteMany({});
  await AccountModel.deleteMany({});
});

describe("Account Controller Tests", () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("createAccount()", () => {
    it("Devuelve error 404 si el usuario no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      req.body = { userId: fakeId };

      await createAccount(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "El usuario no existe",
      });
    });

    it("Crea cuenta", async () => {
      const user = await UserModel.create({
        username: "u1",
        email: "u1@ex.com",
        phone: "000000000",
        password: "pass123@",
      });
      req.body = { userId: user._id.toString() };

      await createAccount(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);

      const response = res.json.mock.calls[0][0];
      expect(response.message).toBe("Cuenta creada con éxito");
      expect(response.account.user.toString()).toBe(user._id.toString());
      expect(response.account.account_number).toMatch(/^ES\d{22}$/);
      expect(response.account.balance).toBe(0);
      expect(response.account.status).toBe("activa");
    });
  });

  it("Devuelve 404 si la cuenta no existe", async () => {
    const user = await UserModel.create({
      username: "u2",
      email: "u2@ex.com",
      phone: "000000001",
      password: "pass123@",
    });
    req.params = { id: user._id.toString() };

    await getAccountByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Cuenta no encontrada" });
  });

  it("Devuelve 200 cuando la cuenta existe", async () => {
    const user = await UserModel.create({
      username: "u3",
      email: "u3@ex.com",
      phone: "000000002",
      password: "pass123@",
    });
    const account = await AccountModel.create({
      user: user._id,
      account_number: "ES6566666666666666666666",
    });
    req.params = { id: user._id.toString() };

    await getAccountByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cuenta obtenida con éxito",
      account: expect.objectContaining({
        _id: account._id,
        user: user._id,
        account_number: "ES6566666666666666666666",
      }),
    });
  });
});
