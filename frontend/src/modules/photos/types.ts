import { EntityStore } from 'src/types';
import { PhotoData } from 'src/types/photos';

// action names

export const ADD_PHOTO = 'photos/ADD_PHOTO';
export const SAVE_PHOTO = 'photos/SAVE_PHOTO';

// action types

export interface AddPhotoAction {
  type: typeof ADD_PHOTO;
}

export interface SavePhotoAction {
  type: typeof SAVE_PHOTO;
  data: PhotoData;
}

export type PhotosActionTypes = AddPhotoAction | SavePhotoAction;

// state types

export interface PhotosState {
  photos: EntityStore<PhotoData>;
}
