import { Dokument, DokumentTyp } from '@dv/shared/model/gesuch';

export interface DocumentOptions {
  gesuchId: string;
  dokumentTyp: DokumentTyp;
}

export interface DocumentUpload extends Dokument {
  progress?: number;
}

export interface DocumentState {
  documents: DocumentUpload[];
  loading: boolean;
  errors?: { translationKey: string; values?: unknown }[];
  allowedFormats: string;
}
