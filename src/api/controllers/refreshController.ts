import { FastifyRequest, FastifyReply } from "fastify";
import refreshService from "../../application/services/refreshService";
import { RefreshRequestBody } from "../../infrastructure/schemas/refreshSchema";

export default {
  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = request.body as RefreshRequestBody;
      const tokens = await refreshService.refreshToken(refreshToken);
      return reply.status(200).send(tokens);
    } catch (error: any) {
      request.log.error(error);
      return reply
        .status(error.status || 500)
        .send({ error: error.message || "Internal Server Error" });
    }
  },
};
