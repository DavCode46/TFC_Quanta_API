// import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import request from "supertest";
// import app from "../src/app.js";
// import Account from "../src/models/Account.model.js";
// import User from "../src/models/User.model.js";
// import generateUniqueIBAN from "../src/utils/generateAccount.js";

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   await mongoose.connect(mongoServer.getUri());
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// describe("Account Routes Integration Tests", () => {
//   const base = "/api/accounts";

//   it("should respond 201 when user exists", async () => {
//     const user = await User.create({
//       username: "u",
//       email: "u@x.com",
//       password: "hashed",
//       phone: "123456789",
//     });
//     generateUniqueIBAN.mockResolvedValue("IBANINT");
//     const res = await request(app).post(base).send({ userId: user._id });
//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty("account");
//     expect(res.body.account).toHaveProperty("account_number", "IBANINT");
//   });

//   it("should respond 404 when user does not exist", async () => {
//     const res = await request(app)
//       .post(base)
//       .send({ userId: mongoose.Types.ObjectId() });
//     expect(res.status).toBe(404);
//   });

//   it("should retrieve account", async () => {
//     const user = await User.create({
//       username: "u2",
//       email: "u2@x.com",
//       password: "hashed",
//       phone: "123456789",
//     });
//     const account = await Account.create({
//       user: user._id,
//       account_number: "IBANGET",
//     });
//     const res = await request(app).get(`${base}/${user._id}`);
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("account");
//   });
// });
