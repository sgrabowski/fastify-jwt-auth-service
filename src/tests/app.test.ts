import Fastify from "fastify";
import supertest from "supertest";
import authRoutes from "../routes/auth";
import defaultRoutes from "../routes/default";
import prismaPlugin from "../plugins/prisma";

describe("API End-to-End Tests", () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify();
    await app.register(prismaPlugin);
    await app.register(defaultRoutes);
    await app.register(authRoutes);
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

  it("should return 501 Not Implemented for POST /register", async () => {
    const response = await supertest(app.server).post("/register");
    expect(response.status).toBe(501);
    expect(response.body).toEqual({ error: "Not Implemented Yet" });
  });
});
