import supertest from "supertest";
import app from "../app";

describe("Refresh Token API Tests", () => {
  let refreshToken: string;

  beforeAll(async () => {
    await app.ready();
    await app.prisma.$executeRawUnsafe("BEGIN;");

    const registerResponse = await supertest(app.server).post("/register").send({
      username: "test123",
      email: "test@example.com",
      password: "securePass123",
    });

    expect(registerResponse.status).toBe(202);

    const loginResponse = await supertest(app.server).post("/login").send({
      email: "test@example.com",
      password: "securePass123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("refreshToken");

    refreshToken = loginResponse.body.refreshToken;
  });

  afterAll(async () => {
    await app.prisma.$executeRawUnsafe("ROLLBACK;");
    await app.close();
  });

  it("should return a new access token and a new refresh token", async () => {
    const response = await supertest(app.server).post("/refresh").send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    //Check that the refresh token actually changes
    expect(response.body.refreshToken).not.toBe(refreshToken);
  });

  it("should return 401 for an invalid refresh token", async () => {
    const response = await supertest(app.server)
      .post("/refresh")
      .send({ refreshToken: "invalidtoken" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid refresh token" });
  });
});
