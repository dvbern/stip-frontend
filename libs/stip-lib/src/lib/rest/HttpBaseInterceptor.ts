/*
 * Copyright (C) 2023 DV Bern AG, Switzerland
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {filter, first, mergeMap, Observable, take} from "rxjs";
import {Store} from "@ngxs/store";
import {ConfigState} from "../store/state/config.state";

@Injectable({
  providedIn: 'root',
})
export class HttpBaseInterceptor implements HttpInterceptor {

  constructor(private readonly store: Store) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isConfigAPIURL(req.url)) {
      return next.handle(req);
    }
    return this.store.select(ConfigState.deploymentConfig).pipe(
      filter(deploymentConfig => deploymentConfig !== undefined),
      mergeMap(deploymentConfig => {
        const environment = deploymentConfig?.environment !== undefined ? deploymentConfig.environment : '';
        const version = deploymentConfig?.version !== undefined ? deploymentConfig.version : '';

        const clonedRequest = req.clone(
            {
              headers: req.headers.append('environment', environment)
                .append('version', version)
            });
          return next.handle(clonedRequest);
        }));
  }
}

function isConfigAPIURL(url: string): boolean {
  return url.endsWith(`/deployment`);
}
