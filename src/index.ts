import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import authRoutes from "./routes/auth";
import defaultRoutes from "./routes/default";

const fastify = Fastify({
  logger: true,
});

// Register Plugins
fastify.register(prismaPlugin);

// Register Routes
fastify.register(defaultRoutes);
fastify.register(authRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
