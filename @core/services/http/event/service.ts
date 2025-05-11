import { axiosInstance } from "../axiosInstance";
import { Event } from "./schema";

const EventUrl = {
  list: "/event",
};

export const EventService = {
  list: (): Promise<Event> => {
    return axiosInstance({
      method: "GET",
      url: EventUrl.list,
    });
  },
};
