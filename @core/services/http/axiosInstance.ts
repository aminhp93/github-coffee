import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  },
  baseURL: "https://github-coffee-api.vercel.app/api",
});

export { axiosInstance };
