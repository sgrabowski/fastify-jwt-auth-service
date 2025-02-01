import { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.all("/register", async (_request, reply) => {
    reply.status(501).send({ error: "Not Implemented Yet" });
  });
}
