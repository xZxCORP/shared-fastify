import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import { createAuthClient } from "./auth.client.js";

export interface AuthPluginOptions {
  authServiceUrl: string;
}

declare module "fastify" {
  interface FastifyInstance {
    authClient: ReturnType<typeof createAuthClient>;
    verifyAuth: (request: FastifyRequest) => Promise<number>;
  }
  interface FastifyRequest {
    userId?: number;
  }
}

const authPlugin: FastifyPluginAsync<AuthPluginOptions> = async (
  fastify,
  options,
) => {
  const { authServiceUrl } = options;

  const authClient = createAuthClient({ baseUrl: authServiceUrl });
  fastify.decorate("authClient", authClient);

  const verifyAuth = async (request: FastifyRequest): Promise<number> => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error("Token manquant");
    }

    try {
      let userId = undefined;
      const bearerToken = authHeader.split(" ")[1];
      if (!bearerToken) {
        throw new Error("Token invalide");
      }
      const result = await authClient.authentication.verify({
        body: {
          token: bearerToken,
        },
      });
      if (result.status !== 200) {
        throw new Error("Token invalide");
      }

      userId = result.body;

      return userId;
    } catch {
      throw new Error("Erreur d'authentification");
    }
  };
  fastify.decorate("verifyAuth", verifyAuth);
};
export default fp(authPlugin, {
  name: "wheelz-auth-plugin",
  fastify: "4.x",
});
