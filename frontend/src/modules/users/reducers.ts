import produce from 'immer';

import { createEntityStore, saveEntityToStore } from 'src/utils/stores';
import * as types from './types';

const initialState: types.UsersState = {
  users: createEntityStore()
};

const usersReducer = produce((draft: types.UsersState, action: types.UsersActionTypes) => {
  switch (action.type) {
    case types.SAVE_USER: {
      const data = action.data;
      saveEntityToStore(draft.users, data);
      return;
    }
  }
}, initialState);

export default usersReducer;
