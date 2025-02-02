import { FastifyInstance } from "fastify";
import registerRoutes from "./register";
import loginRoutes from "./login";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.register(registerRoutes);
  fastify.register(loginRoutes);
}
