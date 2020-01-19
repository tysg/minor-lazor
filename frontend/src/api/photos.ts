import { ApiPromise } from 'src/types';
import { PhotoData } from 'src/types/photos';
import { createFormData } from 'src/utils/formdata-helper';
import BaseAPI from './base';

export interface WithToken {
  csrf_token: string | null;
}

class PhotosAPI extends BaseAPI {
  public addPhoto(photo: PhotoData): ApiPromise<{ photo: PhotoData }> {
    const fd = new FormData();
    createFormData(fd, 'photo', photo);
    return this.post(`${this.getUrl()}`, photo, true);
  }

  protected getUrl() {
    return '/photos';
  }
}

export default PhotosAPI;
