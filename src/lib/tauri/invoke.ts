import { invoke } from '@tauri-apps/api/tauri';
import { IpcResponse } from './types';

export async function invokeCommand<T, R>(
  command: string,
  params: T,
): Promise<R> {
  const response: IpcResponse<R> = await invoke<IpcResponse<R>>(command, {
    params,
  });

  if (response.status === 'Error') {
    throw new Error(response.error.message);
  }

  return response.result.data;
}
