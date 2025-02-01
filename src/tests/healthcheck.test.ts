import Fastify from "fastify";
import supertest from "supertest";
import defaultRoutes from "../routes/default";
import prismaPlugin from "../plugins/prisma";

describe("Health Check API Tests", () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify();
    await app.register(prismaPlugin);
    await app.register(defaultRoutes);
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
