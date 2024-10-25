import { initClient } from "@ts-rest/core";
import { authenticationContract } from "@zcorp/wheelz-contracts";
export interface AuthClientConfig {
  baseUrl: string;
  baseHeaders?: Record<string, string>;
}
export const createAuthClient = (config: AuthClientConfig) => {
  return initClient(authenticationContract, {
    baseUrl: config.baseUrl,
    baseHeaders: config.baseHeaders || {},
  });
};
