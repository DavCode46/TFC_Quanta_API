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
import UserModel from "../../src/models/User.model.js";

describe("Account Routes Tests", () => {
  let mongoServer;
  const base = "/api/accounts";
  let user, token;

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

    await request(app).post("/api/users/register").send({
      username: "acctuser",
      email: "acct@int.com",
      phone: "999999999",
      password: "Abc@1234",
      confirmPassword: "Abc@1234",
    });
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: "acct@int.com", password: "Abc@1234" });
    token = loginRes.body.token;
    user = await UserModel.findOne({ email: "acct@int.com" });
  });

  it("POST /create → 201 + account", async () => {
    const res = await request(app)
      .post(`${base}/create`)
      .send({ userId: user._id.toString() });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Cuenta creada con éxito");
    expect(res.body.account).toHaveProperty("user", user._id.toString());
    expect(res.body.account).toHaveProperty("account_number");
  });

  it("GET /get/:id → 200 + account (protegido)", async () => {
    await AccountModel.deleteMany({ user: user._id });

    const createRes = await request(app)
      .post(`${base}/create`)
      .send({ userId: user._id.toString() });
    expect(createRes.status).toBe(201);

    const acc = createRes.body.account;

    const res = await request(app)
      .get(`${base}/get/${user._id.toString()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Cuenta obtenida con éxito");
    expect(res.body.account).toHaveProperty("_id", acc._id);
    expect(res.body.account).toHaveProperty(
      "account_number",
      acc.account_number
    );
  });
});
