import { FastifyInstance } from "fastify";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import { registerSchema } from "../schemas/registerSchema";
import { loginSchema } from "../schemas/loginSchema";

export default async function registerRoutes(fastify: FastifyInstance) {
  fastify.post("/register", { schema: registerSchema }, registerController.register);
  fastify.post("/login", { schema: loginSchema }, loginController.login);
}
