import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import fs from "fs";
import path from "path";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: {
      private: fs.readFileSync(path.join(__dirname, "../../keys/private.pem")),
      public: fs.readFileSync(path.join(__dirname, "../../keys/public.pem")),
    },
    sign: {
      algorithm: "RS256",
      expiresIn: process.env.JWT_EXPIRATION || "5m", // Default to 5 minutes
    },
  });

  fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      fastify.log.error(err);
      reply.status(401).send({ error: "Unauthorized" });
    }
  });
});
