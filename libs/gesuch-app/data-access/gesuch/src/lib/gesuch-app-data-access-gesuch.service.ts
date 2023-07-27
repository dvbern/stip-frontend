import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Gesuch,
  GesuchCreate,
  SHARED_MODEL_GESUCH_RESOURCE,
  SharedModelGesuch,
  SharedModelGesuchFormular,
} from '@dv/shared/model/gesuch';
import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';
import { getBenutzerId } from '@dv/shared/util-fn/local-storage-helper';

const RESOURCE_URL =
  `${SHARED_MODEL_API_URL}${SHARED_MODEL_GESUCH_RESOURCE}` as const;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessGesuchService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<SharedModelGesuch[]>(
      `${RESOURCE_URL}/benutzer/${getBenutzerId()}`
    );
  }

  get(id: string) {
    return this.http.get<SharedModelGesuch>(`${RESOURCE_URL}/${id}`);
  }

  getByFallId(id: string) {
    return this.http.get<Gesuch[]>(`${RESOURCE_URL}/fall/${id}`);
  }

  create(gesuch: GesuchCreate) {
    // use REST because then it is compatible with mock backend
    return this.http.post<null>(`${RESOURCE_URL}`, gesuch);
  }

  update(gesuchId: string, gesuchFormular: Partial<SharedModelGesuchFormular>) {
    // use REST because then it is compatible with mock backend
    return this.http.patch<void>(`${RESOURCE_URL}/${gesuchId}`, {
      gesuch_formular_to_work_with: gesuchFormular,
    });
  }

  remove(id: string) {
    return this.http.delete<void>(`${RESOURCE_URL}/${id}`);
  }
}
