import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  GesuchsperiodeDTO,
  SHARED_MODEL_GESUCH_RESOURCE,
  SHARED_MODEL_GESUCHSPERIODE_RESOURCE,
} from '@dv/shared/model/gesuch';
import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}${SHARED_MODEL_GESUCHSPERIODE_RESOURCE}`;
@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessGesuchsperiodeService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<GesuchsperiodeDTO[]>(`${RESOURCE_URL}/aktive`);
  }
}
