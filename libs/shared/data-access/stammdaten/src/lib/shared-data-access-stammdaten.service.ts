import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';
import { LandDTO } from '@dv/shared/model/gesuch';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}/stammdaten/lands`;

@Injectable({ providedIn: 'root' })
export class SharedDataAccessStammdatenService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<LandDTO[]>(RESOURCE_URL);
  }
}
