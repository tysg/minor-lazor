import { EntityStore } from 'src/types';
import { UserData } from 'src/types/users';

// action names

export const ADD_USER = 'users/ADD_USER';
export const SAVE_USER = 'users/SAVE_USER';

// action types

export interface AddUserAction {
  type: typeof ADD_USER;
}

export interface SaveUserAction {
  type: typeof SAVE_USER;
  data: UserData;
}

export type UsersActionTypes =
  | AddUserAction
  | SaveUserAction;

// state types

export interface UsersState {
  users: EntityStore<UserData>;
}
