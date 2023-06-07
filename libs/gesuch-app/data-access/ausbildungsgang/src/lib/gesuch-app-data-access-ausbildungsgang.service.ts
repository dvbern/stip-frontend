import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';
import { AusbildungsgangLand } from '@dv/shared/model/gesuch';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}/ausbildungsgangTree`;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessAusbildungsgangService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<AusbildungsgangLand[]>(RESOURCE_URL);
  }
}
