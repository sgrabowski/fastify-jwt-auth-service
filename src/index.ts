import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Define a simple GET / endpoint that returns "Hello World"
fastify.get('/', async (request, reply) => {
  return { message: 'Hello World' };
});

const start = async () => {
  try {
    // Listen on 0.0.0.0 so that the container is reachable from the host
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server running on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

