import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, interval, merge, Observable, of, Subject } from 'rxjs';
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

const PROGRESS_ANIMATION_TIME = 600;
const FORMAT_ERROR = 'shared.file.invalidFormat';
const GENERIC_ERROR = 'shared.genericError.general';

@Injectable()
export class DocumentStore extends ComponentStore<DocumentState> {
  private documentService = inject(GesuchService);

  constructor() {
    super({
      loading: false,
      documents: [],
      errors: undefined,
      // Currently hardcoded, will be given by Backend later on
      allowedFormats: 'image/tiff,image/jpeg,image/png,application/pdf',
    });
  }

  private cancelDocumentUpload$ = new Subject<{
    dokumentId: string;
    options: DocumentOptions;
  }>();

  cancelDocumentUpload(action: {
    dokumentId: string;
    options: DocumentOptions;
  }) {
    this.cancelDocumentUpload$.next(action);
  }

  readonly effectGetDocuments = this.effect(
    (options$: Observable<DocumentOptions>) =>
      options$.pipe(
        tap(() => {
          this.patchState({ loading: true });
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
                () => {
                  this.patchState({
                    errors: [{ translationKey: GENERIC_ERROR }],
                    loading: false,
                  });
                }
              )
            )
        )
      )
  );

  readonly effectClearErrors = this.effect((options$: Observable<void>) =>
    options$.pipe(
      tap(() => {
        return this.patchState({ errors: undefined });
      })
    )
  );

  readonly effectRemoveDocument = this.effect(
    (
      documentIdWithOptions$: Observable<{
        dokumentId: string;
        options: DocumentOptions;
      }>
    ) => {
      return documentIdWithOptions$.pipe(
        tap(() => {
          this.patchState({ loading: true });
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
                () =>
                  this.patchState({
                    errors: [{ translationKey: GENERIC_ERROR }],
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
          this.patchState({ loading: true });
        }),
        mergeMap(({ fileUpload, options: { dokumentTyp, gesuchId } }) => {
          const tempDokumentId = createTempId(fileUpload);
          const dokumentUpload$ = this.documentService
            .createDokument$({ dokumentTyp, gesuchId, fileUpload }, 'events')
            .pipe(shareReplay({ bufferSize: 1, refCount: true }));
          const cancellingThisDocument$ = this.cancelDocumentUpload$.pipe(
            filter((d) => d.dokumentId === tempDokumentId),
            shareReplay({ bufferSize: 1, refCount: true })
          );
          // Fake an upload status change, could be removed if this feature is being integrated in backend
          const uploading$ = merge(
            dokumentUpload$,
            combineLatest([
              dokumentUpload$,
              interval(PROGRESS_ANIMATION_TIME),
            ]).pipe(
              takeWhile(([event]) => event.type !== HttpEventType.Response),
              map(([, i]) =>
                createHttpEvent({
                  type: HttpEventType.UploadProgress,
                  loaded: fileUpload.size - fileUpload.size / (i + 1),
                  total: fileUpload.size,
                })
              )
            )
          ).pipe(
            takeUntil(cancellingThisDocument$),
            shareReplay({ bufferSize: 1, refCount: true })
          );
          return merge(
            uploading$,
            cancellingThisDocument$.pipe(
              map(() =>
                createHttpEvent({
                  type: HttpEventType.User,
                })
              )
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
                          id: tempDokumentId,
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
                        tempDokumentId,
                        (event.loaded / fileUpload.size) * 100
                      ),
                    }))();
                    break;
                  }
                  case HttpEventType.User: {
                    this.updater((state) => ({
                      ...state,
                      documents: state.documents.filter(
                        (d) => d.id !== tempDokumentId
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
                        tempDokumentId,
                        100
                      ),
                    }))();
                    this.effectGetDocuments({ dokumentTyp, gesuchId });
                    break;
                  }
                }
              },
              (error) => {
                const parsedError = sharedUtilFnErrorTransformer(error);
                const status = parsedError.status;
                this.patchState((state) => ({
                  loading: areFilesUploading(state),
                  documents: state.documents.filter(
                    (d) => d.id !== createTempId(fileUpload)
                  ),
                  errors: [
                    ...(state.errors ?? []),
                    ...(status === 400
                      ? [
                          {
                            translationKey: FORMAT_ERROR,
                            values: {
                              file: fileUpload.name,
                              formats: state.allowedFormats
                                .split(',')
                                .map((f) => '.' + f.split('/')[1])
                                .join(', '),
                            },
                          },
                        ]
                      : [{ translationKey: GENERIC_ERROR }]),
                  ],
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

function createHttpEvent(event: HttpEvent<unknown>) {
  return event;
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
