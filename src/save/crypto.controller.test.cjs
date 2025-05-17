import { describe, expect, it, jest } from "@jest/globals";
import {
  getCompleteCryptoDataById,
  getCompleteCryptosData,
  getCryptoData,
  getCryptoDataById,
} from "../src/controllers/cryptoController.js";
import { completeCryptoData, cryptoData } from "../src/data/crypto.js";

describe("Crypto Controller Unit Tests", () => {
  it("getCryptoData returns full cryptoData array", () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getCryptoData(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(cryptoData);
  });

  it("getCompleteCryptosData returns completeCryptoData object", () => {
    const req = { query: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getCompleteCryptosData(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(completeCryptoData);
  });

  it("getCryptoDataById returns 404 if id not found", () => {
    const req = { params: { id: "9999" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getCryptoDataById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Crypto no encontrada" });
  });

  it("getCryptoDataById returns crypto when id exists", () => {
    const sample = cryptoData[0];
    const req = { params: { id: String(sample.id) } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getCryptoDataById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(sample);
  });

  it("getCompleteCryptoDataById returns 404 if id not found in complete", () => {
    const req = { params: { id: "9999" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getCompleteCryptoDataById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Crypto no encontrada" });
  });

  it("getCompleteCryptoDataById returns data when id exists", () => {
    const key = Object.keys(completeCryptoData)[0];
    const req = { params: { id: key } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getCompleteCryptoDataById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(completeCryptoData[key]);
  });
});
