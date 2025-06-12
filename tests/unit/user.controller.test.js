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

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AccountModel from "../../src/models/Account.model.js";
import UserModel from "../../src/models/User.model.js";

import {
  deleteAccount,
  getUserByEmail,
  login,
  register,
  updateUserInfo,
} from "../../src/controllers/user.controller.js";

let mongoServer;

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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

describe("User Controller Tests ", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, files: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("register() - registrar un usuario y crear cuenta", async () => {
    bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPwd");

    req.body = {
      username: "user1",
      email: "user@example.com",
      phone: "123456789",
      password: "Abcde@123",
      confirmPassword: "Abcde@123",
    };

    await register(req, res);

    const savedUser = await UserModel.findOne({ email: "user@example.com" });
    expect(savedUser).not.toBeNull();
    const savedAccount = await AccountModel.findOne({ user: savedUser._id });
    expect(savedAccount).not.toBeNull();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.stringContaining("Usuario user@example.com registrado con éxito")
    );
  });

  it("login() - devolver token con credenciales válidas", async () => {
    const rawPwd = "pwd1234";
    const hashed = await bcrypt.hash(rawPwd, 12);
    const u = await UserModel.create({
      username: "usr",
      email: "test@ex.com",
      phone: "000",
      password: hashed,
    });

    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("jwt-token");

    req.body = { email: "test@ex.com", password: rawPwd };
    await login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({ id: u._id }),
      "testsecret",
      expect.objectContaining({ expiresIn: "1d" })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "jwt-token" })
    );
  });

  it("updateUserInfo() - actualizar datos del usuario", async () => {
    const rawPwd = "Old@1234";
    const hashed = await bcrypt.hash(rawPwd, 12);
    const user = await UserModel.create({
      username: "u",
      email: "old@example.com",
      phone: "000000000",
      password: hashed,
    });

    bcrypt.compare = jest
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    bcrypt.genSalt = jest.fn().mockResolvedValue("newSalt");
    bcrypt.hash = jest.fn().mockResolvedValue("newHashedPwd");

    req.body = {
      userId: user._id.toString(),
      currentPassword: rawPwd,
      newPassword: "New@1234",
      email: "new@example.com",
      phone: "985722654",
    };

    await updateUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        phone: "985722654",
      })
    );
  });

  it("getUserByEmail() - devolver usuario existente", async () => {
    const user = await UserModel.create({
      username: "u2",
      email: "findme@example.com",
      phone: "985722654",
      password: "irrelevant",
    });

    req.params = { email: "findme@example.com" };
    await getUserByEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ _id: user._id, email: user.email })
    );
  });

  it("deleteAccount() - cerrar cuenta y eliminar usuario", async () => {
    const user = await UserModel.create({
      username: "u3",
      email: "toremove@example.com",
      phone: "985722654",
      password: "irrelevant",
    });
    const acc = await AccountModel.create({
      user: user._id,
      account_number: "IBANDEL",
    });

    req.params = { userId: user._id.toString() };
    await deleteAccount(req, res);

    const udb = await UserModel.findById(user._id);
    expect(udb).toBeNull();
    const adb = await AccountModel.findById(acc._id);
    expect(adb.status).toBe("cerrada");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cuenta eliminada con éxito",
    });
  });
});
