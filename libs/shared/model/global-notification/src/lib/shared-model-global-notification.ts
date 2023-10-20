import { SharedModelError } from '@dv/shared/model/error';

export type SharedModelGlobalNotification = {
  id: number;
  autohide: boolean;
  message?: string;
  messageKey?: string;
  content: SharedModelError;
};
