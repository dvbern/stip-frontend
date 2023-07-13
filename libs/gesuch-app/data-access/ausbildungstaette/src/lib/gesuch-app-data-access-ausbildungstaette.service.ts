import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';
import { Ausbildungsstaette } from '@dv/shared/model/gesuch';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}/ausbildungstaette/all`;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessAusbildungstaetteService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Ausbildungsstaette[]>(RESOURCE_URL);
  }
}
