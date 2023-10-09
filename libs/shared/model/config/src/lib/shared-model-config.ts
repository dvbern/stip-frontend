// TODO how to generate with OpenAPI?
export interface SharedModelDeploymentConfig {
  environment?: string;
  version?: string;
}

export type AppType = `${'gesuch' | 'sachbearbeitung'}-app`;
export type CompiletimeConfig = Pick<
  SharedModelCompiletimeConfig,
  'appType' | 'authClientId'
>;

export class SharedModelCompiletimeConfig {
  readonly authClientId: `stip-${AppType}`;
  readonly appType: AppType;

  constructor(config: CompiletimeConfig) {
    this.authClientId = config.authClientId;
    this.appType = config.appType;
  }
}

// TODO extract to env or generate with OpenAPI?
export const SHARED_MODEL_CONFIG_RESOURCE = `/config/deployment`;
