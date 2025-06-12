import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import app from "../../src/app.js";
import AccountModel from "../../src/models/Account.model.js";
import TransactionModel from "../../src/models/Transaction.model.js";
import UserModel from "../../src/models/User.model.js";

describe("Transaction Routes Integration Tests", () => {
  let mongoServer;
  let token1;
  let user1;
  let account1;
  let token2;
  let user2;
  let account2;
  const base = "/api/transactions";

  beforeAll(async () => {
    process.env.JWT_SECRET = "testsecret";
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});

    await request(app).post("/api/users/register").send({
      username: "user1",
      email: "u1@ex.com",
      phone: "111111111",
      password: "Abc@1234",
      confirmPassword: "Abc@1234",
    });
    const loginRes1 = await request(app)
      .post("/api/users/login")
      .send({ email: "u1@ex.com", password: "Abc@1234" });
    token1 = loginRes1.body.token;
    user1 = await UserModel.findOne({ email: "u1@ex.com" });
    account1 = await AccountModel.findOne({ user: user1._id });

    await request(app).post("/api/users/register").send({
      username: "user2",
      email: "u2@ex.com",
      phone: "222222222",
      password: "Abc@1234",
      confirmPassword: "Abc@1234",
    });
    const loginRes2 = await request(app)
      .post("/api/users/login")
      .send({ email: "u2@ex.com", password: "Abc@1234" });
    token2 = loginRes2.body.token;
    user2 = await UserModel.findOne({ email: "u2@ex.com" });
    account2 = await AccountModel.findOne({ user: user2._id });
  });

  it("POST /add → 200 + transaction", async () => {
    const res = await request(app)
      .post(`${base}/add`)
      .set("Authorization", `Bearer ${token1}`)
      .send({ amount: 100, account_number: account1.account_number });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Transacción realizada con éxito"
    );
    expect(res.body.transaction).toMatchObject({
      type: "ingreso",
      amount: 100,
      destination_account: account1._id.toString(),
    });
  });

  it("POST /withdraw → 200 + transaction", async () => {
    await request(app)
      .post(`${base}/add`)
      .set("Authorization", `Bearer ${token1}`)
      .send({ amount: 80, account_number: account1.account_number });

    const res = await request(app)
      .post(`${base}/withdraw`)
      .set("Authorization", `Bearer ${token1}`)
      .send({ amount: 30, account_number: account1.account_number });

    expect(res.status).toBe(200);
    expect(res.body.transaction).toMatchObject({
      type: "retirada",
      amount: 30,
      origin_account: account1._id.toString(),
    });
  });

  it("POST /transfer → 200 + transaction", async () => {
    await request(app)
      .post(`${base}/add`)
      .set("Authorization", `Bearer ${token1}`)
      .send({ amount: 200, account_number: account1.account_number });

    const res = await request(app)
      .post(`${base}/transfer`)
      .set("Authorization", `Bearer ${token1}`)
      .send({
        amount: 50,
        origin_account: account1.account_number,
        destination_account: account2.account_number,
      });

    expect(res.status).toBe(200);
    expect(res.body.transaction).toMatchObject({
      type: "transferencia",
      amount: 50,
      origin_account: account1._id.toString(),
      destination_account: account2._id.toString(),
    });
  });
});
