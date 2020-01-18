import { applyMiddleware, combineReducers, createStore, Middleware, Reducer } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { loadingBarReducer } from 'react-redux-loading-bar';

const rootReducer: Reducer<any> = combineReducers<any>({
  loadingBar: loadingBarReducer
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
