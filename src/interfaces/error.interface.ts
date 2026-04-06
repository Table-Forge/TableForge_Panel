interface IError {
  status?: number;
  code?: string;
  message?: string;
  stackTrace?: string;
  title?: string;
}

interface IBackendError {
  Code: string;
  Message: string;
  Title: string;
  Id: string;
}

export type { IBackendError, IError };
