import { FastifyInstance } from "fastify";

export default async function defaultRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (_request, reply) => {
    return reply.status(200).send({ status: "OK" });
  });
}
