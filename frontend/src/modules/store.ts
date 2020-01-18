import { applyMiddleware, combineReducers, createStore, Middleware, Reducer } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { loadingBarReducer } from 'react-redux-loading-bar';

import { AppState } from 'src/types';
import notificationsReducer from './notifications';
import usersReducer from './users';

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  loadingBar: loadingBarReducer,
  notifications: notificationsReducer,
  users: usersReducer
});

const middlewares: Middleware[] = [thunk];

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    predicate: (getState, action) => action.type.lastIndexOf('loading-bar/', 0) !== 0
  });

  middlewares.push(logger);
}

export default function configureStore() {
  return createStore(rootReducer, applyMiddleware(...middlewares));
}
