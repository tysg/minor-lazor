import api from 'src/api';
import { ApiResponse, ApiPromise, Operation } from 'src/types';
import { PhotoData } from 'src/types/photos';
import * as actions from './actions';
import { getPhoto } from './selectors';

export function addPhoto(photo: PhotoData): Operation<ApiResponse<PhotoData>> {
  return async (dispatch, getState) => {
    const response = await api.photos.addPhoto(photo);
    const data = response.data.photo;
    dispatch(actions.savePhoto(photo));
    dispatch(actions.addPhoto());
    return { ...response, data: getPhoto(getState(), data.id)! };
  };
}
