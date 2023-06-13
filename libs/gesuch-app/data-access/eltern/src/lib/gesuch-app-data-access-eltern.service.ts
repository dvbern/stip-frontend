import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  SHARED_MODEL_API_URL,
  SHARED_MODEL_ELTERN_RESOURCE,
} from '@dv/shared/model/api';
import { Anrede, ElternContainerDTO } from '@dv/shared/model/gesuch';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}${SHARED_MODEL_ELTERN_RESOURCE}`;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessElternService {
  private http = inject(HttpClient);

  getElternForGesuch(gesuchId: string, geschlecht: Anrede) {
    return this.http.get<ElternContainerDTO>(
      `${RESOURCE_URL}/gesuch/${gesuchId}/${geschlecht}`
    );
  }
}
