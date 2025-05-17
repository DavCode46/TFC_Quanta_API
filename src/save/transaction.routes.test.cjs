// import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import request from "supertest";
// import app from "../src/app.js";
// import UserModel from "../src/models/User.model.js";

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   await mongoose.connect(mongoServer.getUri());
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// describe("User Routes Integration Tests", () => {
//   const base = "/api/users";
//   it("POST /register → 201", async () => {
//     /*...*/
//   });
//   it("POST /login → 200", async () => {
//     /*...*/
//   });
//   it("GET /:email → 200", async () => {
//     /*...*/
//   });
//   it("DELETE /:userId → 200", async () => {
//     /*...*/
//   });
// });

// // tests/integration/accountRoutes.test.js
// import { describe, expect, it } from "@jest/globals";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import request from "supertest";
// import app from "../src/app.js";
// import Account from "../src/models/Account.model.js";
// import User from "../src/models/User.model.js";
// import generateUniqueIBAN from "../src/utils/generateAccount.js";

// //... account tests ...

// // tests/integration/transactionRoutes.test.js
// import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import request from "supertest";
// import app from "../src/app.js";
// import Account from "../src/models/Account.model.js";
// import Transaction from "../src/models/Transaction.model.js";
// import User from "../src/models/User.model.js";

// let mongoServerTrans;

// beforeAll(async () => {
//   mongoServerTrans = await MongoMemoryServer.create();
//   await mongoose.connect(mongoServerTrans.getUri());
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServerTrans.stop();
// });

// describe("Transaction Routes Integration Tests", () => {
//   const base = "/api/transactions";
//   let user, acc1, acc2;

//   beforeAll(async () => {
//     user = await User.create({
//       username: "u",
//       email: "u@x.com",
//       password: "hashed",
//       phone: "123456789",
//     });
//     acc1 = await Account.create({
//       user: user._id,
//       account_number: "IBAN1",
//       balance: 100,
//     });
//     acc2 = await Account.create({
//       user: user._id,
//       account_number: "IBAN2",
//       balance: 0,
//     });
//   });

//   it("POST /add → 200", async () => {
//     const res = await request(app)
//       .post(`${base}/add`)
//       .send({ amount: 50, account_number: acc1.account_number });
//     expect(res.status).toBe(200);
//     expect(res.body.transaction).toHaveProperty("amount", 50);
//   });

//   it("POST /withdraw → 200", async () => {
//     const res = await request(app)
//       .post(`${base}/withdraw`)
//       .send({ amount: 30, account_number: acc1.account_number });
//     expect(res.status).toBe(200);
//     expect(res.body.transaction).toHaveProperty("type", "retirada");
//   });

//   it("POST /transfer → 200", async () => {
//     const res = await request(app)
//       .post(`${base}/transfer`)
//       .send({
//         amount: 20,
//         origin_account: acc1.account_number,
//         destination_account: acc2.account_number,
//       });
//     expect(res.status).toBe(200);
//     expect(res.body.transaction).toHaveProperty("amount", 20);
//   });

//   it("GET /:email → 200", async () => {
//     const res = await request(app).get(`${base}/${user.email}`);
//     expect(res.status).toBe(200);
//     expect(res.body.transactions).toBeInstanceOf(Array);
//   });
// });
