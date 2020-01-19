import api from 'src/api';
import { ApiResponse, ApiPromise, Operation } from 'src/types';
import { UserData } from 'src/types/users';
import * as actions from './actions';
import { getUser } from './selectors';

export function addUser(user: UserData): Operation<ApiResponse<UserData>> {
  return async (dispatch, getState) => {
    const response = await api.users.addUser(user);
    const data = response.data.user;
    dispatch(actions.saveUser(user));
    dispatch(actions.addUser());
    return { ...response, data: getUser(getState(), data.id)! };
  };
}
