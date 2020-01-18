import { UserData } from 'src/types/users';
import * as types from './types';

export function addUser(): types.AddUserAction {
  return {
    type: types.ADD_USER
  };
}

export function saveUser(data: UserData): types.SaveUserAction {
  return {
    type: types.SAVE_USER,
    data
  };
}
