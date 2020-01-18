import { AppState } from 'src/types';

function getLocalState(state: AppState) {
  return state.photos;
}

export function getAllPhotos(state: AppState) {
  return getLocalState(state).photos;
}

export function getPhoto(state: AppState, id: number) {
  return getLocalState(state).photos.byId[id] || null;
}
