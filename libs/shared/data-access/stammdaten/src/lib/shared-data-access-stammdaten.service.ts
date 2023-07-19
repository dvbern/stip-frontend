import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';
import { Land } from '@dv/shared/model/gesuch';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}/stammdaten/land` as const;

@Injectable({ providedIn: 'root' })
export class SharedDataAccessStammdatenService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Land[]>(RESOURCE_URL);
  }
}
