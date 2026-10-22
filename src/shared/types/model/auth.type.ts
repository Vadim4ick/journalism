export interface LoginParams {
  login: string;
  password: string;
  captcha_token: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  access_expires_in: number;
  refresh_expires_in: number;
}

export type LoginResponse = { message: string; data: LoginResponseData };
export type LogoutResponse = { message: string; data: Record<string, never> };

export interface UserGroup {
  id: number;
  code: string;
  name: string;
}

export interface Profile {
  id: number;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  second_name: string | null;
  full_name: string;
  active: boolean;
  blocked: boolean;
  date_register: string;
  last_login: string | null;
  groups: UserGroup[];
  group_codes: string[];
}

export type MeResponse = ApiSuccessResponse<Profile>;

export type LoginErrorResponse = ApiErrorResponse<{
  login: string;
  password: string;
}>;
