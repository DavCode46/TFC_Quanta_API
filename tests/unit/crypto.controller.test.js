import { describe, expect, it, jest } from "@jest/globals";
import {
  getCompleteCryptosData,
  getCryptoData,
  getCryptoDataById,
} from "../../src/controllers/crypto.controller.js";
import { completeCryptoData, cryptoData } from "../../src/data/crypto.js";

describe("Crypto Controller Unit Tests", () => {
  it("Devuelve lista de criptomonedas y código de estado 200", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = {};

    await getCryptoData(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(cryptoData);
  });

  it("Devuelve lista completa de criptomonedas y código de estado 200", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = {};

    await getCompleteCryptosData(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(completeCryptoData);
  });

  it("Devuelve error 404 si la criptomoneda no se encuentra", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: {} };

    await getCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Crypto no encontrada" });
  });

  it("Devuelve una criptomoneda y código 200", async () => {
    const first = cryptoData[0];
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: { id: String(first.id) } };

    await getCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(first);
  });
});
