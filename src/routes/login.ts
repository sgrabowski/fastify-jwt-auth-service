import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";

export default async function loginRoutes(fastify: FastifyInstance) {
  fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    fastify.log.info("Login attempt from %s", email);

    try {
      const user = await fastify.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      fastify.log.debug("Creating access and refresh tokens");

      const accessToken = fastify.jwt.sign({ email: user.email });
      const refreshToken = fastify.jwt.sign(
        {},
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" },
      );

      fastify.log.debug("Saving the refresh token");

      await fastify.prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
        },
      });

      return reply.status(200).send({ accessToken, refreshToken });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
