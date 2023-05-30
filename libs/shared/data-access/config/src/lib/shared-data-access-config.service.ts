import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  SHARED_MODEL_CONFIG_RESOURCE,
  SharedModelDeploymentConfig,
} from '@dv/shared/model/config';
import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}${SHARED_MODEL_CONFIG_RESOURCE}`;

@Injectable({ providedIn: 'root' })
export class SharedDataAccessConfigService {
  private http = inject(HttpClient);

  getDeploymentConfig() {
    // TODO extract API URL to environment / service
    return this.http.get<SharedModelDeploymentConfig>(RESOURCE_URL);
  }
}
