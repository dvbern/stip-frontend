import { SharedModelError } from '@dv/shared/model/error';

export interface DocumentOptions {
  resource: string;
  resourceId: string;
  type?: string;
}

export interface Document {
  id: string;
}

export interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: SharedModelError | undefined;
}
