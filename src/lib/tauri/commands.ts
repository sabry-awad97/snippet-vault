import { RegisterFormData } from '../schemas/user';
import { invokeCommand } from './invoke';
import { PostParams } from './types';

type Credentials = {
  email: string;
  password: string;
};

type UserForm = {
  email: string;
  password: string;
};

type AuthPayload = {
  token: string;
  refresh_token: string;
  user: any;
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
