import { IUser } from "./User";

export interface IAuth {
  user: IUser | null,
  accessToken: string | null,
  refreshToken: string | null,
  isLoading: boolean,
  error: string | undefined | null
}