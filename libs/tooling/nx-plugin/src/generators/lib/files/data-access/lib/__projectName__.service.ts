import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class <%= classify(projectName) %>Service {
  private http = inject(HttpClient);

  getAll() {
    // TODO interface should come from a model lib
    return this.http.get<any[]>('<api-url>');
  }
}