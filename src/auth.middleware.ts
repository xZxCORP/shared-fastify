import type { FastifyReply, FastifyRequest } from "fastify";

export const requireAuth = () => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await request.server.verifyAuth(request);
      request.user = user;
    } catch (error) {
      reply.status(401).send({
        message: error instanceof Error ? error.message : "Non authentifié",
      });
    }
  };
};

export const requireAnyRoles = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user) {
        throw new Error("Veuillez utiliser requireAuth avant");
      }
      if (!roles.some((role) => user.roles.includes(role))) {
        throw new Error("Vous n'avez pas les droits nécessaires");
      }
    } catch (error) {
      reply.status(403).send({
        message: error instanceof Error ? error.message : "Non autorisé",
      });
    }
  };
};
export const requireAllRoles = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user) {
        throw new Error("Veuillez utiliser requireAuth avant");
      }
      if (!roles.every((role) => user.roles.includes(role))) {
        throw new Error("Vous n'avez pas les droits nécessaires");
      }
    } catch (error) {
      reply.status(403).send({
        message: error instanceof Error ? error.message : "Non autorisé",
      });
    }
  };
};
