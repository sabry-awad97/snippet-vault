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
  return await invokeCommand<PostParams<Credentials>, AuthPayload>(
    'login',
    params,
  );
}

export async function register(
  params: PostParams<UserForm>,
): Promise<AuthPayload> {
  return await invokeCommand<PostParams<UserForm>, AuthPayload>(
    'register',
    params,
  );
}

export async function refreshToken(
  params: PostParams<string>,
): Promise<AuthPayload> {
  return await invokeCommand<PostParams<string>, AuthPayload>(
    'refresh_token',
    params,
  );
}
