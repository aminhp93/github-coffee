type RemoteModule = {
  url: string;
  baseUrl: string;
  scope: string;
  module: Record<string, string>;
  hostName: string;
  port: number;
};

const isServer = typeof window === "undefined";

const HOST_NAME = !isServer
  ? window.location.protocol + "//" + window.location.hostname
  : "";

const REMOTE_PATH = `/_next/static/chunks/remoteEntry.js?`;

const RemoteModuleConfigObj: {
  [key: string]: Omit<RemoteModule, "url" | "baseUrl" | "scope">;
} = {
  "github-coffee": {
    port: 3000,
    module: {
      index: "./index",
    },
    hostName: "https://github-coffee.vercel.app",
  },
  "github-coffee-blog": {
    port: 3001,
    module: {
      index: "./index",
    },
    hostName: "https://aminhp93.vercel.app",
  },
};

function getRemoteModule() {
  const res: {
    [key: string]: RemoteModule;
  } = {};
  Object.keys(RemoteModuleConfigObj).forEach((key) => {
    const hostName = RemoteModuleConfigObj[key].hostName;
    const port = RemoteModuleConfigObj[key].port;
    const baseUrl =
      process.env.NODE_ENV === "production" ? hostName : `${HOST_NAME}:${port}`;

    res[key] = {
      ...RemoteModuleConfigObj[key],
      scope: key,
      url: `${baseUrl}${REMOTE_PATH}`,
      baseUrl,
    };
  });

  return res;
}

const AppConfig = {
  remoteModule: getRemoteModule(),
};

export default AppConfig;
