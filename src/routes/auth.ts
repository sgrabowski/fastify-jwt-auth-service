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
}
