import * as EVENTS from "../../store/constants/events";

/**
 * Refresh events with current filter
 */
export const fetchEvents = () => ({
  type: EVENTS.FETCH_EVENTS,
});

/**
 * @param {EventFilter} filter
 */
export const updateEventFilter = (filter) => ({
  type: EVENTS.UPDATE_EVENT_FILTER,
  filter: filter,
});

/**
 * Replace current set of events in store
 * @param {Event[]} payload
 */
export const newEventSet = (payload) => {
  return {
    type: EVENTS.NEW_EVENTSET,
    payload,
  };
};
