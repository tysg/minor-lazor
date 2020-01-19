import { ApiPromise } from 'src/types';
import { UserData } from 'src/types/users';
import { createFormData } from 'src/utils/formdata-helper';
import BaseAPI from './base';

export interface WithToken {
  csrf_token: string | null;
}

class UsersAPI extends BaseAPI {
  public addUser(user: UserData): ApiPromise<{ user: UserData }> {
    const fd = new FormData();
    createFormData(fd, 'user', user);
    return this.post(`${this.getUrl()}/create`, user, true);
  }

  protected getUrl() {
    return '/users';
  }
}

export default UsersAPI;
