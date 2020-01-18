import produce from 'immer';

import { createEntityStore, saveEntityToStore } from 'src/utils/stores';
import * as types from './types';

const initialState: types.PhotosState = {
  photos: createEntityStore()
};

const usersReducer = produce((draft: types.PhotosState, action: types.PhotosActionTypes) => {
  switch (action.type) {
    case types.SAVE_PHOTO: {
      const data = action.data;
      saveEntityToStore(draft.photos, data);
      return;
    }
  }
}, initialState);

export default usersReducer;
