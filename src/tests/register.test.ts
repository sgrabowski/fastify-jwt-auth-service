import supertest from "supertest";
import app from "../app";

describe("Registration (Using Transactions)", () => {
  beforeAll(async () => {
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
    await supertest(app.server).post("/register").send({
      email: "duplicate@example.com",
      username: "duplicateuser",
      password: "securePass123",
    });

    const response = await supertest(app.server).post("/register").send({
      email: "duplicate@example.com",
      username: "duplicateuser",
      password: "securePass123",
    });

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

  it("should return 400 if email is missing", async () => {
    const response = await supertest(app.server)
      .post("/register")
      .send({ username: "testuser", password: "securePass123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("body must have required property 'email'");
  });

  it("should return 400 if username is missing", async () => {
    const response = await supertest(app.server)
      .post("/register")
      .send({ email: "test@example.com", password: "securePass123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("body must have required property 'username'");
  });

  it("should return 400 if password is missing", async () => {
    const response = await supertest(app.server)
      .post("/register")
      .send({ email: "test@example.com", username: "testuser" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("body must have required property 'password'");
  });
});
