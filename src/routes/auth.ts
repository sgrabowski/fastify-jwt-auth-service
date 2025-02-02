import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";

const registerSchema = {
  body: {
    type: "object",
    required: ["email", "username", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      username: {
        type: "string",
        minLength: 3,
      },
      password: {
        type: "string",
        minLength: 8,
      },
    },
    additionalProperties: false,
  },
};

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    { schema: registerSchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, username, password } = request.body as {
        email: string;
        username: string;
        password: string;
      };

      try {
        const existingUser = await fastify.prisma.user.findFirst({
          where: { OR: [{ email }, { username }] },
        });

        if (existingUser) {
          return reply.status(409).send({ error: "Email or Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await fastify.prisma.user.create({
          data: { email, username, passwordHash: hashedPassword },
        });

        return reply.status(202).send();
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

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
