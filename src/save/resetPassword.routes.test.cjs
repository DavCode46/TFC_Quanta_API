// import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import request from "supertest";
// import app from "../src/app.js";
// import PasswordResetCode from "../src/models/ResetPassword.model.js";
// import User from "../src/models/User.model.js";

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   await mongoose.connect(mongoServer.getUri());
// });
// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// describe("Password Reset Routes Integration Tests", () => {
//   const base = "/api/auth"; // adjust if needed

//   it("POST /send-code returns 200 when user exists", async () => {
//     await User.create({
//       username: "u",
//       email: "u@x.com",
//       password: "hashed",
//       phone: "123456789",
//     });
//     const res = await request(app)
//       .post(`${base}/send-code`)
//       .send({ email: "u@x.com" });
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("message");
//   });

//   it("POST /reset-password resets password", async () => {
//     const userDoc = await User.findOne({ email: "u@x.com" });
//     await PasswordResetCode.create({
//       userId: userDoc._id,
//       code: "123456",
//       expiresAt: new Date(Date.now() + 600000),
//     });
//     const res = await request(app)
//       .post(`${base}/reset-password`)
//       .send({ email: "u@x.com", code: "123456", newPassword: "Valid@1234" });
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("message");
//   });

//   it("POST /reset-password returns 400 for invalid code", async () => {
//     const res = await request(app)
//       .post(`${base}/reset-password`)
//       .send({ email: "u@x.com", code: "000000", newPassword: "Valid@1234" });
//     expect(res.status).toBe(400);
//   });
// });
