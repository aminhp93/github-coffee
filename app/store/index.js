import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { delay, fork } from "redux-saga/effects";

import { eventsSaga, eventsReducer } from "./events";

export const rootReducer = combineReducers({
  events: eventsReducer,
});

function* rootSaga() {
  try {
    // Setup new system
    // Delay to prevent race conditions
    yield delay(100);
    yield fork(eventsSaga);
  } catch (e) {
    console.error(e);
  }
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
