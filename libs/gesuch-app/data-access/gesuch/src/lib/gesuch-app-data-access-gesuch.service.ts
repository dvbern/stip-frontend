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

const RESOURCE_URL =
  `${SHARED_MODEL_API_URL}${SHARED_MODEL_GESUCH_RESOURCE}` as const;

@Injectable({ providedIn: 'root' })
export class GesuchAppDataAccessGesuchService {
  private http = inject(HttpClient);

  getAll(benutzerId: string) {
    return this.http.get<SharedModelGesuch[]>(
      `${RESOURCE_URL}/benutzer/${benutzerId}`
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
    // TODO: Analyze options to prevent sending unwanted properties and cleanup this workaround
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      freigegeben,
      lebenslaufItems,
      geschwisters,
      elterns,
      kinds,
      ...formular
    } = gesuchFormular;
    return this.http.patch<void>(`${RESOURCE_URL}/${gesuchId}`, {
      gesuch_formular_to_work_with: {
        ...formular,
        lebenslaufItems: lebenslaufItems?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
        elterns: elterns?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
        kinds: kinds?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
        geschwisters: geschwisters?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
      },
    });
  }

  remove(id: string) {
    return this.http.delete<void>(`${RESOURCE_URL}/${id}`);
  }
}
