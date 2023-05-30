// TODO how to generate with OpenAPI?
export interface SharedModelDeploymentConfig {
  environment?: string;
  version?: string;
}

// TODO extract to env or generate with OpenAPI?
export const SHARED_MODEL_CONFIG_RESOURCE = `/config/deployment`;
