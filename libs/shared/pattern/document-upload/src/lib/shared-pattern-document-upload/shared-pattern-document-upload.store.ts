import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  HttpEventType,
  HttpProgressEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, interval, merge, Observable, Subject } from 'rxjs';
import {
  concatMap,
  mergeMap,
  map,
  switchMap,
  tap,
  takeWhile,
  shareReplay,
  takeUntil,
  filter,
} from 'rxjs/operators';

import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { GesuchService } from '@dv/shared/model/gesuch';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';

import {
  DocumentOptions,
  DocumentState,
  DocumentUpload,
} from './shared-pattern-document-upload.model';

@Injectable()
export class DocumentStore extends ComponentStore<DocumentState> {
  private documentService = inject(GesuchService);

  constructor() {
    super({ loading: false, documents: [], error: undefined });
  }

  readonly effectGetDocuments = this.effect(
    (options$: Observable<DocumentOptions>) =>
      options$.pipe(
        tap(() => {
          this.patchState({ loading: true, error: undefined });
        }),
        switchMap(({ gesuchId, dokumentTyp }) =>
          this.documentService
            .getDokumenteForTyp$({ dokumentTyp, gesuchId })
            .pipe(
              tapResponse(
                (documents) => {
                  this.patchState((state) => ({
                    documents: [
                      ...documents,
                      ...state.documents.filter(
                        (d) =>
                          sharedUtilFnTypeGuardsIsDefined(d.progress) &&
                          d.progress !== 100
                      ),
                    ],
                    loading: false,
                  }));
                },
                (error) => {
                  this.patchState({
                    error: sharedUtilFnErrorTransformer(error),
                    loading: false,
                  });
                }
              )
            )
        )
      )
  );

  private cancelDocument$ = new Subject<{
    dokumentId: string;
    options: DocumentOptions;
  }>();

  effectCancelDocument(action: {
    dokumentId: string;
    options: DocumentOptions;
  }) {
    this.cancelDocument$.next(action);
  }

  readonly effectRemoveDocument = this.effect(
    (
      documentIdWithOptions$: Observable<{
        dokumentId: string;
        options: DocumentOptions;
      }>
    ) => {
      return documentIdWithOptions$.pipe(
        tap(() => {
          this.patchState({ loading: true, error: undefined });
        }),
        concatMap(({ dokumentId, options: { dokumentTyp, gesuchId } }) =>
          this.documentService
            .deleteDokument$({ dokumentId, dokumentTyp, gesuchId })
            .pipe(
              tapResponse(
                () =>
                  this.updater((state) => ({
                    ...state,
                    documents: state.documents.filter(
                      (document) => document.id !== dokumentId
                    ),
                    loading: false,
                  }))(),
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
        fileUpload: File;
        options: DocumentOptions;
      }>
    ) => {
      return documentIdWithOptions$.pipe(
        tap(() => {
          this.patchState({ loading: true, error: undefined });
        }),
        mergeMap(({ fileUpload, options: { dokumentTyp, gesuchId } }) => {
          const dokumentId = createTempId(fileUpload);
          const dokumentUpload$ = this.documentService
            .createDokument$({ dokumentTyp, gesuchId, fileUpload }, 'events')
            .pipe(shareReplay({ bufferSize: 1, refCount: true }));
          const cancellingThisDocument$ = this.cancelDocument$.pipe(
            filter((d) => d.dokumentId === dokumentId),
            shareReplay({ bufferSize: 1, refCount: true })
          );
          const uploading$ = merge(
            dokumentUpload$,
            combineLatest([dokumentUpload$, interval(500)]).pipe(
              takeWhile(([event]) => event.type !== HttpEventType.Response),
              map(
                ([, i]) =>
                  ({
                    loaded: fileUpload.size - fileUpload.size / (i + 1),
                    type: HttpEventType.UploadProgress,
                    total: fileUpload.size,
                  } as HttpProgressEvent)
              )
            )
          ).pipe(
            takeUntil(cancellingThisDocument$),
            shareReplay({ bufferSize: 1, refCount: true })
          );
          return merge(
            uploading$,
            cancellingThisDocument$.pipe(
              map<unknown, HttpUserEvent<unknown>>(() => ({
                type: HttpEventType.User,
              }))
            )
          ).pipe(
            tapResponse(
              (event) => {
                switch (event.type) {
                  case HttpEventType.Sent: {
                    this.updater((state) => ({
                      ...state,
                      loading: true,
                      documents: [
                        ...state.documents,
                        {
                          filename: fileUpload.name,
                          filesize: fileUpload.size.toString(),
                          filepfad: '',
                          id: dokumentId,
                          objectId: '',
                          progress: 0,
                        },
                      ],
                    }))();
                    break;
                  }
                  case HttpEventType.UploadProgress: {
                    this.updater((state) => ({
                      ...state,
                      loading: true,
                      documents: updateProgressFor(
                        state.documents,
                        dokumentId,
                        (event.loaded / fileUpload.size) * 100
                      ),
                    }))();
                    break;
                  }
                  case HttpEventType.User: {
                    this.updater((state) => ({
                      ...state,
                      documents: state.documents.filter(
                        (d) => d.id !== dokumentId
                      ),
                    }))();
                    this.effectGetDocuments({ dokumentTyp, gesuchId });
                    break;
                  }
                  case HttpEventType.Response: {
                    this.updater((state) => ({
                      ...state,
                      documents: updateProgressFor(
                        state.documents,
                        dokumentId,
                        100
                      ),
                    }))();
                    this.effectGetDocuments({ dokumentTyp, gesuchId });
                    break;
                  }
                }
              },
              (error) => {
                this.patchState((state) => ({
                  loading: areFilesUploading(state),
                  documents: state.documents.filter(
                    (d) => d.id !== createTempId(fileUpload)
                  ),
                  error: sharedUtilFnErrorTransformer(error),
                }));
              }
            )
          );
        })
      );
    }
  );
}

function areFilesUploading(state: DocumentState) {
  return state.documents.some((d) => d.progress && d.progress < 100);
}

function createTempId(document: File) {
  return `uploading-${document.name}${document.size}${document.type}`;
}

function updateProgressFor(
  dokumente: DocumentUpload[],
  dokumentId: string,
  progress: number
) {
  return dokumente.map((d) => {
    if (d.id === dokumentId) {
      return { ...d, progress };
    }
    return d;
  });
}
