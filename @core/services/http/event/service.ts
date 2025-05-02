import { axiosInstance } from "../axiosInstance";
import { Event } from "./schema";

const EventUrl = {
  list: "/api/event",
};

export const EventService = {
  list: (): Promise<Event> => {
    return axiosInstance({
      method: "GET",
      url: EventUrl.list,
    });
  },
};
