import { ApiPromise } from 'src/types';
import BaseAPI from './base';

export interface WithToken {
  csrf_token: string | null;
}

class TrainingAPI extends BaseAPI {
  public startTraining(): ApiPromise<{}> {
    return this.post(`${this.getUrl()}`);
  }

  protected getUrl() {
    return '/training';
  }
}

export default TrainingAPI;
