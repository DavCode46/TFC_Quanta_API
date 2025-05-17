// import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
// import request from "supertest";
// import app from "../src/app.js";
// import { completeCryptoData, cryptoData } from "../src/data/crypto.js";

// describe("Crypto Routes Integration Tests", () => {
//   const base = "/api/cryptos";

//   it("GET /api/cryptos returns list of cryptos", async () => {
//     const res = await request(app).get(base);
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(cryptoData);
//   });

//   it("GET /api/cryptos/complete returns full details", async () => {
//     const res = await request(app).get(`${base}/complete`);
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(completeCryptoData);
//   });

//   it("GET /api/cryptos/:id returns crypto or 404", async () => {
//     const sample = cryptoData[0];
//     let res = await request(app).get(`${base}/${sample.id}`);
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(sample);
//     res = await request(app).get(`${base}/9999`);
//     expect(res.status).toBe(404);
//   });

//   it("GET /api/cryptos/complete/:id returns complete crypto or 404", async () => {
//     const keys = Object.keys(completeCryptoData);
//     const res = await request(app).get(`${base}/complete/${keys[0]}`);
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(completeCryptoData[keys[0]]);
//   });
// });
