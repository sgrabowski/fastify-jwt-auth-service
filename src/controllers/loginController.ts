import { FastifyRequest, FastifyReply } from "fastify";
import loginService from "../services/loginService";
import { LoginRequestBody } from "../schemas/loginSchema";

export default {
  async login(request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) {
    try {
      const tokens = await loginService.login(request.body);
      return reply.status(200).send(tokens);
    } catch (error: any) {
      request.log.error(error);
      return reply
        .status(error.status || 500)
        .send({ error: error.message || "Internal Server Error" });
    }
  },
};
