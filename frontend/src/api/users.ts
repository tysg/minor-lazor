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
    fd.forEach((key, value) => console.log('key: ' + key + ' value: ' + value));
    return this.post(`${this.getUrl()}`, fd, true);
  }

  protected getUrl() {
    return '/users';
  }
}

export default UsersAPI;
