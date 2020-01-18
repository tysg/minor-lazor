import { Action, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { types as notifications } from 'src/modules/notifications';
import { types as photos } from 'src/modules/photos';
import { types as users } from 'src/modules/users';

export interface ThunkDispatchProps {
  dispatch: ThunkDispatch<any, {}, AnyAction>;
}

export interface StatusMessage {
  content: string;
  type: StatusMessageType;
}

export enum StatusMessageType {
  Error = 1,
  Warning = 2,
  Information = 3,
  Success = 4
}

export interface ApiResponse<D, E = {}> {
  code: number;
  data: D;
  messages: StatusMessage[];
  errors: E;
}

export type ApiPromise<D, E = {}> = Promise<ApiResponse<D, E>>;

export interface AppState {
  loadingBar: any;
  notifications: notifications.NotificationsState;
  photos: photos.PhotosState;
  users: users.UsersState;
}

export type Operation<R> = ThunkAction<Promise<R>, AppState, {}, AnyAction>;

interface EntityMetadata {
  // The timestamp at which the entity was last updated, in number of milliseconds since UTC.
  lastUpdate: number;
  // The timestamp at which the full entity was last updated, in number of milliseconds since UTC.
  lastFullUpdate: number;
}

export interface EntityStore<M, E extends M = M> {
  byId: { [key: number]: (M & Partial<E> & EntityMetadata) | undefined };
}

declare module 'redux' {
  // Overload to add thunk support to Redux's dispatch() function.
  export interface Dispatch<A extends Action = AnyAction> {
    // tslint:disable-next-line
    <R, E>(thunk: ThunkAction<R, AppState, E, AnyAction>): R;
  }
}
