export type PostParams<D> = {
  data: D;
};

export type PutParams<D> = {
  id: string;
  data: D;
};

export type ListParams<F> = {
  filter?: F;
};

export type GetParams = {
  id: string;
};

export type DeleteParams = {
  id: string;
};

export type IpcError = {
  message: string;
};

export type IpcSimpleResult<D> = {
  data: D;
};

export type IpcResponse<D> =
  | { status: 'Success'; result: IpcSimpleResult<D> }
  | { status: 'Error'; error: IpcError };
