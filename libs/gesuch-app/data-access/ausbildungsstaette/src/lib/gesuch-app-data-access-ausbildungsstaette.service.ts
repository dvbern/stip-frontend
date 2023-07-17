import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';
import { Ausbildungsstaette } from '@dv/shared/model/gesuch';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}/ausbildungsstaette` as const;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessAusbildungsstaetteService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Ausbildungsstaette[]>(RESOURCE_URL);
  }
}
