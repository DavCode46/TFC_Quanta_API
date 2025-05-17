import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import {
  resetPassword,
  sendCode,
} from "../src/controllers/passwordController.js";
import PasswordResetCode from "../src/models/ResetPassword.model.js";
import User from "../src/models/User.model.js";
import { sendResetPasswordEmail } from "../src/utils/sendEmail.js";

jest.mock("bcryptjs");
jest.mock("../src/models/ResetPassword.model.js");
jest.mock("../src/models/User.model.js");
jest.mock("../src/utils/sendEmail.js");

describe("Password Reset Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe("sendCode", () => {
    it("returns 400 if user not found", async () => {
      req.body = { email: "unknown@ex.com" };
      User.findOne.mockResolvedValue(null);
      await sendCode(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuario no encontrado.",
      });
    });

    it("sends code and returns 200 on success", async () => {
      req.body = { email: "user@ex.com" };
      const user = { _id: "u1", email: "user@ex.com" };
      User.findOne.mockResolvedValue(user);
      const record = { findOneAndUpdate: jest.fn().mockResolvedValue({}) };
      PasswordResetCode.findOneAndUpdate = jest.fn().mockResolvedValue(record);
      sendResetPasswordEmail.mockResolvedValue();

      await sendCode(req, res);

      expect(PasswordResetCode.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: user._id },
        expect.objectContaining({ code: expect.any(String) }),
        { upsert: true, new: true }
      );
      expect(sendResetPasswordEmail).toHaveBeenCalledWith(
        "user@ex.com",
        expect.any(String)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Código de restablecimiento de contraseña enviado a tu correo.",
      });
    });
  });

  describe("resetPassword", () => {
    it("returns 400 if user not found", async () => {
      req.body = {
        email: "no@ex.com",
        code: "123456",
        newPassword: "New@1234",
      };
      User.findOne.mockResolvedValue(null);
      await resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuario no encontrado.",
      });
    });

    it("returns 400 if record not found", async () => {
      const user = { _id: "u1" };
      req.body = {
        email: "user@ex.com",
        code: "000000",
        newPassword: "New@1234",
      };
      User.findOne.mockResolvedValue(user);
      PasswordResetCode.findOne.mockResolvedValue(null);
      await resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Código incorrecto." });
    });

    it("returns 400 if code expired", async () => {
      const user = { _id: "u1" };
      const record = { code: "111111", expiresAt: Date.now() - 1000 };
      req.body = {
        email: "user@ex.com",
        code: "111111",
        newPassword: "New@1234",
      };
      User.findOne.mockResolvedValue(user);
      PasswordResetCode.findOne.mockResolvedValue(record);
      await resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Código expirado." });
    });

    it("returns 400 for invalid password", async () => {
      const user = { _id: "u1", save: jest.fn() };
      const record = { code: "222222", expiresAt: Date.now() + 10000 };
      req.body = { email: "user@ex.com", code: "222222", newPassword: "short" };
      User.findOne.mockResolvedValue(user);
      PasswordResetCode.findOne.mockResolvedValue(record);
      await resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });

    it("resets password and deletes record on success", async () => {
      const user = { _id: "u1", save: jest.fn() };
      const record = {
        code: "333333",
        expiresAt: Date.now() + 10000,
        deleteOne: jest.fn(),
      };
      req.body = {
        email: "user@ex.com",
        code: "333333",
        newPassword: "Valid@1234",
      };
      User.findOne.mockResolvedValue(user);
      PasswordResetCode.findOne.mockResolvedValue(record);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpwd");

      await resetPassword(req, res);
      expect(bcrypt.hash).toHaveBeenCalledWith("Valid@1234", 12);
      expect(user.save).toHaveBeenCalled();
      expect(record.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contraseña restablecida correctamente.",
      });
    });
  });
});
