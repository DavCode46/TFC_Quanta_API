import { describe, expect, it, jest } from "@jest/globals";
import {
  getCompleteCryptoDataById,
  getCompleteCryptosData,
  getCryptoData,
  getCryptoDataById,
} from "../../src/controllers/crypto.controller.js";
import { completeCryptoData, cryptoData } from "../../src/data/crypto.js";

describe("Crypto Controller Unit Tests", () => {
  it("getCryptoData returns full list with status 200", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = {};

    await getCryptoData(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(cryptoData);
  });

  it("getCompleteCryptosData returns full complete list with status 200", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = {};

    await getCompleteCryptosData(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(completeCryptoData);
  });

  it("getCryptoDataById returns 404 for missing id", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: {} };

    await getCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Crypto no encontrada" });
  });

  it("getCryptoDataById returns 404 for non-existent id", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: { id: "999" } };

    await getCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Crypto no encontrada" });
  });

  it("getCryptoDataById returns item with status 200", async () => {
    const first = cryptoData[0];
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: { id: String(first.id) } };

    await getCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(first);
  });

  it("getCompleteCryptoDataById returns 404 for missing id", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: {} };

    await getCompleteCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Crypto no encontrada" });
  });

  it("getCompleteCryptoDataById returns 404 for non-existent id", async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: { id: "999" } };

    await getCompleteCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Crypto no encontrada" });
  });

  it("getCompleteCryptoDataById returns item with status 200", async () => {
    const key = Object.keys(completeCryptoData)[0];
    const item = completeCryptoData[key];
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };
    const req = { params: { id: key } };

    await getCompleteCryptoDataById(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(item);
  });
});
