import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  SHARED_MODEL_API_URL,
  SHARED_MODEL_ELTERN_RESOURCE,
} from '@dv/shared/model/api';
import { ElternContainerDTO } from '@dv/shared/model/gesuch';

// TODO add resource url (should it come from model lib or just inline ?)
const RESOURCE_URL = `${SHARED_MODEL_API_URL}${SHARED_MODEL_ELTERN_RESOURCE}`;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessElternService {
  private http = inject(HttpClient);

  get(gesuchId: string) {
    return this.http.get<ElternContainerDTO>(`${RESOURCE_URL}/${gesuchId}`);
  }
}
