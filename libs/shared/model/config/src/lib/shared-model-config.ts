// TODO how to generate with OpenAPI?
export interface SharedModelDeploymentConfig {
  environment?: string;
  version?: string;
}

export class SharedModelCompiletimeConfig {
  readonly authClientId: `stip-${'gesuch' | 'sachbearbeitung'}-app`;
  readonly isSachbearbeitung: boolean;

  constructor(config: SharedModelCompiletimeConfig) {
    this.authClientId = config.authClientId;
    this.isSachbearbeitung = config.isSachbearbeitung;
  }
}

// TODO extract to env or generate with OpenAPI?
export const SHARED_MODEL_CONFIG_RESOURCE = `/config/deployment`;
