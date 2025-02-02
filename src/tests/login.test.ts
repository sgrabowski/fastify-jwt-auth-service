import supertest from "supertest";
import app from "../app";

describe("Login (Using Transactions)", () => {
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

  it("should return 200 and valid tokens for valid login", async () => {
    await supertest(app.server).post("/register").send({
      email: "valid@example.com",
      username: "validuser",
      password: "securePass123",
    });

    const response = await supertest(app.server).post("/login").send({
      email: "valid@example.com",
      password: "securePass123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    const decoded = app.jwt.verify(response.body.accessToken);

    expect(decoded).toHaveProperty("email", "valid@example.com");
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
  });

  it("should return 401 if email does not exist", async () => {
    const response = await supertest(app.server).post("/login").send({
      email: "nonexistent@example.com",
      password: "wrongPassword123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid email or password" });
  });

  it("should return 401 if password is incorrect", async () => {
    await supertest(app.server).post("/register").send({
      email: "wrongpass@example.com",
      username: "wronguser",
      password: "securePass123",
    });

    const response = await supertest(app.server).post("/login").send({
      email: "wrongpass@example.com",
      password: "wrongPassword123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid email or password" });
  });
});
