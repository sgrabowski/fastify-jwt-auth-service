import supertest from "supertest";
import app from "../app";

describe("Health Check API Tests", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return { status: 'OK' } on GET /", async () => {
    const response = await supertest(app.server).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "OK" });
  });
});
