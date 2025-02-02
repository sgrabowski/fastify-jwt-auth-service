import { FastifyRequest, FastifyReply } from "fastify";
import registerService from "../../application/services/registerService";
import { RegisterRequestBody } from "../../infrastructure/schemas/registerSchema";

export default {
  async register(request: FastifyRequest<{ Body: RegisterRequestBody }>, reply: FastifyReply) {
    try {
      await registerService.register(request.body);
      return reply.status(202).send();
    } catch (error: any) {
      request.log.error(error);
      return reply
        .status(error.status || 500)
        .send({ error: error.message || "Internal Server Error" });
    }
  },
};
