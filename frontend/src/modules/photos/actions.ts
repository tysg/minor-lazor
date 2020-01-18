import { PhotoData } from 'src/types/photos';
import * as types from './types';

export function addPhoto(): types.AddPhotoAction {
  return {
    type: types.ADD_PHOTO
  };
}

export function savePhoto(data: PhotoData): types.SavePhotoAction {
  return {
    type: types.SAVE_PHOTO,
    data
  };
}
