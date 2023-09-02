import { updateObject } from "./utils";
import { put, takeEvery, select } from "redux-saga/effects";
import axios from "axios";
import { newEventSet } from "./actions/events";
import {
  FETCH_EVENTS,
  NEW_EVENTSET,
  UPDATE_EVENT_FILTER,
} from "./constants/events";
// import CliComs from "../Core/lib/CliComs";
// import { prettyTime } from "./alarms";
import qs from "qs";

// Events Selectors
/**
 *
 * @param state full state
 * @returns {Event[]}
 */
export const selectFilteredEvents = (state) => state.events.filteredEvents;

/**
 *
 * @param state full state
 */
export const selectEventFilter = (state) => state.events.eventFilter;

export const defaultEventFilter = {
  limit: 100,
  sort: ["time", "desc"],
  ignore: {
    columns: ["user"],
    isEmpty: true,
    isNull: true,
  },
};

/**
 * @class EventState
 *
 */
const initialState = {
  /**
   * @type {GetAuditLogRequest}
   */
  eventFilter: defaultEventFilter,

  /** @type {Event[]} */
  filteredEvents: [],
};

/**
 * Events Reducer
 * @param {EventState} state old state
 * @param {import("../../lib/sagas/effects").Action} action

 * @returns {initialState} new state
 */
export const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EVENT_FILTER: {
      return updateObject(state, {
        eventFilter: updateObject(state.eventFilter, action.filter),
      });
    }

    case NEW_EVENTSET: {
      return updateObject(state, {
        filteredEvents: action.payload,
      });
    }

    default: {
      return state;
    }
  }
};

function* fetchEventsSaga() {
  const eventFilter = new GetAuditLogRequest(yield select(selectEventFilter));

  /** @type {Event[]} */
  //   const response = yield CliComs.promiseSend({
  //     type: AUDIT_LOG_GET_EVENTS,
  //     payload: request,
  //   });

  let type = "ALL";
  if (eventFilter?.ignore?.isEmpty) {
    type = "NOT_EMPTY";
  }

  const response = yield axios({
    method: "GET",
    url: "/api",
    params: {
      type,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });
  const mappedRes = response.data?.data || [];

  yield put(
    newEventSet(
      mappedRes.map((event) => {
        const eventObj = new AuditEvent(event);
        // eventObj.time = prettyTime(eventObj.time);
        return eventObj;
      })
    )
  );
}

/**
 * Events saga
 */
export function* eventsSaga() {
  yield takeEvery(UPDATE_EVENT_FILTER, fetchEventsSaga);
  yield takeEvery(FETCH_EVENTS, fetchEventsSaga);
}

export const refreshEvents = () => ({
  type: UPDATE_EVENT_FILTER,
});

/**
 * @module AuditLogAPI
 */

class AuditEvent {
  /**
   * Construct from Json data
   *
   * @param {object} data
   */
  constructor(data) {
    //this.paf = 3;
    Object.assign(this, data);
  }

  /**
   * @type {string}
   * @example "SystemConfig"
   */
  component;

  /**
   * @type {string}
   * @example "License updated."
   */
  message;

  /**
   * @type {string}
   * @example "StartupTime"
   */
  name;

  /**
   * @type {timestamp}
   * @example "2020-02-06T09:55:22",
   */
  time;

  /**
   * @type {string}
   * @example "System"
   */
  user;

  /**
   * ChainId
   *
   * Set by web server
   *
   * @type {?uuid}
   */
  chainId;

  /**
   * ObjectId/tagId
   * @type {uuid}
   */
  object;
}

const AUDIT_LOG_GET_EVENTS = "audit_getEvents";

/**
 * 	Method: "getAuditlog"
 */
class GetAuditLogRequest {
  /**
   * Construct from Json data
   *
   * @param {?object} data
   */
  constructor(data) {
    Object.assign(this, data);
  }

  /**
   * Max number of messages to fetch.
   *
   * @type {?number} Default no limit
   * @example 20
   */
  limit;

  /**
   * list of columns to filter against. if empty all columns are used
   * @type {String[]}
   * @example ["user", "name"]
   */
  filterColumn;

  /**
   * The value to filter on
   *
   * @example "System"
   */
  filter;

  /**
   * filter depending on case sensitivity or not. NYI
   * @type {boolean}
   */
  caseSensitiveFilter;

  /**
   * Array with column to sort on and asc or desc
   *
   * @example ["time", "asc"]
   */
  sort;

  /**
   * Start date for fetch
   *
   * When using startDate or days never use both, only use days or startDate/endDate
   *
   * @type {?timestamp}
   * @example "2020-02-27 12:55:23"
   */
  startDate;

  /**
   * End date for fetch. If skipped we use current date as end
   *
   * @type {?timestamp}
   * @example "2020-02-27 12:55:23"
   */
  endDate;

  /**
   * Fetch messages for the last x days
   *
   * When using startDate or days never use both, only use days or startDate/endDate
   *
   * @example 20
   */
  days;
}
