jest.mock("../../src/utils/sendEmail.js", () => ({
  sendResetPasswordEmail: jest.fn().mockResolvedValue(true),
}));

jest.resetModules();

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import {
  resetPassword,
  sendCode,
} from "../../src/controllers/resetPassword.controller.js";
import PasswordResetCode from "../../src/models/ResetPassword.model.js";
import User from "../../src/models/User.model.js";
import { sendResetPasswordEmail } from "../../src/utils/sendEmail.js";

describe("Reset Password Controller Unit Tests", () => {
  let req, res;
  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  describe("sendCode()", () => {
    it("Devuelve error 400 si el usuario no existe", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      req.body = { email: "x@no.com" };
      await sendCode(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuario no encontrado.",
      });
    });
    it("Devuelve éxisto 200 si existe", async () => {
      const mockUser = { _id: "u1", email: "u@ex.com" };
      const mockCode = "123456";

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      PasswordResetCode.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue({ code: mockCode });

      req.body = { email: "u@ex.com" };
      await sendCode(req, res);

      expect(sendResetPasswordEmail).toHaveBeenCalledTimes(1);
      expect(sendResetPasswordEmail).toHaveBeenCalledWith("u@ex.com", mockCode);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Código de restablecimiento de contraseña enviado a tu correo.",
      });
    });
  });

  describe("resetPassword()", () => {
    it("Devuelve error 400 si no existe", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      req.body = { email: "x@no.com", code: "123", newPassword: "Pwd@1234" };
      await resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuario no encontrado.",
      });
    });
    it("Devuelve 400 si el código no es correcto", async () => {
      const u = { _id: "u1" };
      User.findOne = jest.fn().mockResolvedValue(u);
      PasswordResetCode.findOne = jest.fn().mockResolvedValue(null);
      req.body = { email: "u@ex.com", code: "000000", newPassword: "Pwd@1234" };
      await resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Código incorrecto." });
    });
    it("Devuelve 400 si el código ha expirado (15 min)", async () => {
      const u = { _id: "u1" };
      const record = { code: "123456", expiresAt: new Date(Date.now() - 1) };
      User.findOne = jest.fn().mockResolvedValue(u);
      PasswordResetCode.findOne = jest.fn().mockResolvedValue(record);
      req.body = { email: "u@ex.com", code: "123456", newPassword: "Pwd@1234" };
      await resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Código expirado." });
    });
    it("Devuelve 200 al restablecer la contraseña", async () => {
      const u = { _id: "u1", save: jest.fn() };
      const record = {
        code: "123456",
        expiresAt: new Date(Date.now() + 10000),
        deleteOne: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue(u);
      PasswordResetCode.findOne = jest.fn().mockResolvedValue(record);
      bcrypt.hash = jest.fn().mockResolvedValue("newHash");
      req.body = {
        email: "u@ex.com",
        code: "123456",
        newPassword: "Valid@123",
      };
      await resetPassword(req, res);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(u.save).toHaveBeenCalled();
      expect(record.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contraseña restablecida correctamente.",
      });
    });
  });
});
