import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';

// TODO add resource url (should it come from model lib or just inline ?)
const RESOURCE_URL = `${SHARED_MODEL_API_URL}<resource-url>`;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessElternService {
  private http = inject(HttpClient);

  getAll() {
    // TODO interface should come from a model lib
    return this.http.get<any[]>(RESOURCE_URL);
  }
}
