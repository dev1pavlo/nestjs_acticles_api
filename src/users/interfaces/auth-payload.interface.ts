import { IUser } from './user.interface';

export interface IAuthPayload {
  accessToken: string;
  user: Omit<IUser, 'password'>;
}
