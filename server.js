import Fastify from 'fastify';
import dotenv from 'dotenv';
import { registerPredictionRoutes } from './routes/prediction-routes.js';

dotenv.config();

const fastify = Fastify({ logger: false });

// Register routes
registerPredictionRoutes(fastify);

// Health check endpoint
fastify.get('/health', async (req, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await fastify.close();
    console.log('Server closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server is running on ${address}`);
});
