import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app.js";

describe("Crypto Routes Integration Tests", () => {
  let mongoServer, token;
  beforeAll(async () => {
    process.env.JWT_SECRET = "testsecret";
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    await request(app).post("/api/users/register").send({
      username: "u",
      email: "d@d.com",
      phone: "111111111",
      password: "Abc@1234",
      confirmPassword: "Abc@1234",
    });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "d@d.com", password: "Abc@1234" });
    token = res.body.token;
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("GET /api/cryptos/data", async () => {
    const res = await request(app)
      .get("/api/cryptos/data")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/cryptos/data/1", async () => {
    const res = await request(app)
      .get("/api/cryptos/data/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("GET /api/cryptos/data/999 -> 404", async () => {
    const res = await request(app)
      .get("/api/cryptos/data/999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("GET /api/cryptos/complete-data", async () => {
    const res = await request(app)
      .get("/api/cryptos/complete-data")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("GET /api/cryptos/complete-data/1", async () => {
    const res = await request(app)
      .get("/api/cryptos/complete-data/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
