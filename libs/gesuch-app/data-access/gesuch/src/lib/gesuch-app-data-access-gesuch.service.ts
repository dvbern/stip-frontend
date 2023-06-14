import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  SHARED_MODEL_GESUCH_RESOURCE,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import { SHARED_MODEL_API_URL } from '@dv/shared/model/api';

const RESOURCE_URL = `${SHARED_MODEL_API_URL}${SHARED_MODEL_GESUCH_RESOURCE}`;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessGesuchService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<SharedModelGesuch[]>(RESOURCE_URL);
  }

  get(id: string) {
    return this.http.get<SharedModelGesuch>(`${RESOURCE_URL}/${id}`);
  }

  create(gesuch: Partial<SharedModelGesuch>) {
    return this.http.post<{ id: string }>(`${RESOURCE_URL}`, gesuch);
  }

  update(gesuch: Partial<SharedModelGesuch>) {
    return this.http.put<void>(`${RESOURCE_URL}/${gesuch.id}`, gesuch);
  }

  remove(id: string) {
    return this.http.delete<void>(`${RESOURCE_URL}/${id}`);
  }
}
