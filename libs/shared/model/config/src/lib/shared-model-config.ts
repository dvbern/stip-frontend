// TODO how to generate with OpenAPI?
export interface SharedModelDeploymentConfig {
  environment?: string;
  version?: string;
}

export class SharedModelCompiletimeConfig {
  readonly authClientId: `stip-${'gesuch' | 'sachbearbeitung'}-app`;

  constructor(config: Pick<SharedModelCompiletimeConfig, 'authClientId'>) {
    this.authClientId = config.authClientId;
  }
}

// TODO extract to env or generate with OpenAPI?
export const SHARED_MODEL_CONFIG_RESOURCE = `/config/deployment`;
