import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Document } from './shared-pattern-document-upload.model';

@Injectable()
export class DocumentService {
  private httpClient = inject(HttpClient);

  getAll(resource: string, resourceId: string, type?: string) {
    return this.httpClient.get<Document[]>(
      `/${resource}/${resourceId}/document${type ? `/${type}` : ''}`
    );
  }

  upload(resource: string, resourceId: string, file: File, type?: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<Document>(
      `/${resource}/${resourceId}/document${type ? `/${type}` : ''}`,
      formData
    );
  }

  remove(
    resource: string,
    resourceId: string,
    documentId: string,
    type?: string
  ) {
    return this.httpClient.get<void>(
      `/${resource}/${resourceId}/document${
        type ? `/${type}` : ''
      }/${documentId}`
    );
  }
}
