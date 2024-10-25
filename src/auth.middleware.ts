import type { FastifyReply, FastifyRequest } from "fastify";

export const requireAuth = () => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = await request.server.verifyAuth(request);
      request.userId = userId;
    } catch (error) {
      reply.status(401).send({
        message: error instanceof Error ? error.message : "Non autorisé",
      });
    }
  };
};
