import { RegisterFormData, User } from '@/lib/schemas/user';
import { invokeCommand } from '@/lib/tauri/invoke';
import { PostParams } from '@/lib/tauri/types';

type Credentials = {
  email: string;
  password: string;
};

type AuthPayload = {
  token: string;
  refresh_token: string;
  user: User;
};

export async function login(
  params: PostParams<Credentials>,
): Promise<AuthPayload> {
  return await invokeCommand('login', params);
}

export async function register(
  params: PostParams<RegisterFormData>,
): Promise<AuthPayload> {
  return await invokeCommand('register', params);
}

export async function refreshToken(
  params: PostParams<string>,
): Promise<AuthPayload> {
  return await invokeCommand('refresh_token', params);
}
