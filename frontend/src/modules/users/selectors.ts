import { AppState } from 'src/types';

function getLocalState(state: AppState) {
  return state.users;
}

export function getAllUsers(state: AppState) {
  return getLocalState(state).users;
}

export function getUser(state: AppState, id: number) {
  return getLocalState(state).users.byId[id] || null;
}
