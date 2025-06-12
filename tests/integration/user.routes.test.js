import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app.js";
import UserModel from "../../src/models/User.model.js";

process.env.JWT_SECRET = "testsecret";

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Routes Tests", () => {
  const base = "/api/users";

  it("POST /register → 201", async () => {
    const res = await request(app).post(`${base}/register`).send({
      username: "testuser",
      email: "test@int.com",
      phone: "123456789",
      password: "Abc@1234",
      confirmPassword: "Abc@1234",
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatch(/Usuario test@test.com registrado con éxito/);
  });

  it("POST /login → 200 + token", async () => {
    await request(app).post(`${base}/register`).send({
      username: "test2",
      email: "test2@test.com",
      phone: "987654321",
      password: "Abc@1234",
      confirmPassword: "Abc@1234",
    });
    const res = await request(app)
      .post(`${base}/login`)
      .send({ email: "test2@test.com", password: "Abc@1234" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("GET /me/:email → 200 + user", async () => {
    const res = await request(app)
      .get(`${base}/me/test2@test.com`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "test2@test.com");
  });

  it("DELETE /delete/:userId → 200 + message", async () => {
    const created = await UserModel.findOne({ email: "test2@test.com" });
    const res = await request(app)
      .delete(`${base}/delete/${created._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Cuenta eliminada con éxito" });
  });
});
