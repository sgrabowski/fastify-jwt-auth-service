import Fastify from "fastify";
import supertest from "supertest";
import authRoutes from "../routes/auth";
import prismaPlugin from "../plugins/prisma";

describe("Auth API Tests (Using Transactions)", () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify();
    await app.register(prismaPlugin);
    await app.register(authRoutes);
    await app.ready();

    // Begin a database transaction
    await app.prisma.$executeRawUnsafe("BEGIN;");
  });

  afterAll(async () => {
    // Rollback the transaction to clean up the database
    await app.prisma.$executeRawUnsafe("ROLLBACK;");
    await app.close();
  });

  it("should register a new user successfully", async () => {
    const response = await supertest(app.server)
      .post("/register")
      .send({ email: "test@example.com", username: "testuser", password: "securePass123" });

    expect(response.status).toBe(202);
  });

  it("should return 409 if email or username already exists", async () => {
    await supertest(app.server)
      .post("/register")
      .send({ email: "duplicate@example.com", username: "duplicateuser", password: "securePass123" });

    const response = await supertest(app.server)
      .post("/register")
      .send({ email: "duplicate@example.com", username: "duplicateuser", password: "securePass123" });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: "Email or Username already exists" });
  });

  it("should return 400 if username is too short", async () => {
    const response = await supertest(app.server)
      .post("/register")
      .send({ email: "shortname@example.com", username: "a", password: "securePass123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("body/username must NOT have fewer than 3 characters");
  });

  it("should return 400 if password is too short", async () => {
    const response = await supertest(app.server)
      .post("/register")
      .send({ email: "shortpass@example.com", username: "validuser", password: "12345" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("body/password must NOT have fewer than 8 characters");
  });
});
