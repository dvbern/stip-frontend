import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { concatMap, mergeMap, Observable, switchMap, tap } from 'rxjs';

import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

import {
  DocumentOptions,
  DocumentState,
} from './shared-pattern-document-upload.model';
import { DocumentService } from './shared-pattern-document-upload.service';

@Injectable()
export class DocumentStore extends ComponentStore<DocumentState> {
  private documentService = inject(DocumentService);

  constructor() {
    super({ loading: false, documents: [], error: undefined });
  }

  readonly effectGetDocuments = this.effect(
    (options$: Observable<DocumentOptions>) => {
      return options$.pipe(
        tap(() => {
          this.patchState({ loading: true, error: undefined });
        }),
        switchMap(({ resource, resourceId, type }) =>
          this.documentService.getAll(resource, resourceId, type).pipe(
            tapResponse(
              (documents) => this.patchState({ documents, loading: false }),
              (error) =>
                this.patchState({
                  error: sharedUtilFnErrorTransformer(error),
                  loading: false,
                })
            )
          )
        )
      );
    }
  );

  readonly effectRemoveDocument = this.effect(
    (
      documentIdWithOptions$: Observable<{
        documentId: string;
        options: DocumentOptions;
      }>
    ) => {
      return documentIdWithOptions$.pipe(
        tap(() => {
          this.patchState({ loading: true, error: undefined });
        }),
        concatMap(({ documentId, options: { resource, resourceId, type } }) =>
          this.documentService
            .remove(resource, resourceId, documentId, type)
            .pipe(
              tapResponse(
                () =>
                  this.updater((state) => ({
                    ...state,
                    documents: state.documents.filter(
                      (document) => document.id !== documentId
                    ),
                    loading: false,
                  })),
                (error) =>
                  this.patchState({
                    error: sharedUtilFnErrorTransformer(error),
                    loading: false,
                  })
              )
            )
        )
      );
    }
  );

  effectUploadDocument = this.effect(
    (
      documentIdWithOptions$: Observable<{
        document: File;
        options: DocumentOptions;
      }>
    ) => {
      return documentIdWithOptions$.pipe(
        tap(() => {
          this.patchState({ loading: true, error: undefined });
        }),
        mergeMap(({ document, options: { resource, resourceId, type } }) =>
          this.documentService
            .upload(resource, resourceId, document, type)
            .pipe(
              tapResponse(
                (document) =>
                  this.updater((state) => ({
                    ...state,
                    documents: [...state.documents, document],
                    loading: false,
                  })),
                (error) => {
                  this.patchState({
                    error: sharedUtilFnErrorTransformer(error),
                    loading: false,
                  });
                }
              )
            )
        )
      );
    }
  );
}
