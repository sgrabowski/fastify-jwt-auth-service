import Fastify from "fastify";
import prismaPlugin from "./infrastructure/plugins/prisma";
import jwtPlugin from "./infrastructure/plugins/jwt";
import authRoutes from "./infrastructure/routes/auth";
import defaultRoutes from "./infrastructure/routes/default";
import pino from "pino";

const envLogging: Record<string, any> = {
  development: {
    level: "info",
    stream: pino.destination("/var/log/dev.log"),
  },
  production: true,
  test: {
    level: "debug",
    stream: pino.destination({ dest: "/var/log/test.log" }),
  },
};

const environment = process.env.NODE_ENV ?? "development";

const app = Fastify({
  logger: envLogging[environment],
});

// Register Plugins
app.register(prismaPlugin);
app.register(jwtPlugin);

// Register Routes
app.register(defaultRoutes);
app.register(authRoutes);

export default app;
