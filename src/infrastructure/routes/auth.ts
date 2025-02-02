import { FastifyInstance } from "fastify";
import registerController from "../../api/controllers/registerController";
import loginController from "../../api/controllers/loginController";
import { registerSchema } from "../schemas/registerSchema";
import { loginSchema } from "../schemas/loginSchema";
import refreshController from "../../api/controllers/refreshController";
import { refreshSchema } from "../schemas/refreshSchema";

export default async function registerRoutes(fastify: FastifyInstance) {
  fastify.post("/register", { schema: registerSchema }, registerController.register);
  fastify.post("/login", { schema: loginSchema }, loginController.login);
  fastify.post("/refresh", { schema: refreshSchema }, refreshController.refresh);
}
