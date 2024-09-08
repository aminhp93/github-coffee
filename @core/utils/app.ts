type RemoteModule = {
  url: string;
  baseUrl: string;
  scope: string;
  module: Record<string, string>;
};

interface RemoteModuleConfig extends RemoteModule {
  port: number;
  remoteModule: RemoteModule;
}

const isServer = typeof window === "undefined";

const HOST_NAME = !isServer ? window.location.protocol + "//" + window.location.hostname : "";

const RemoteModuleConfigObj: {
  [key: string]: Omit<RemoteModuleConfig, "remoteModule" | "url" | "baseUrl">;
} = {
  home: {
    port: 3000,
    scope: "home",
    module: {
      index: "./index",
    },
  },
  pvItems: {
    port: 3002,
    scope: "pvItemsApplication",
    module: {
      view: "./view",
      editor: "./editor",
    },
  },
  itemsBasic: {
    port: 30020,
    scope: "pvBasicItems",
    module: {
      listItems: "./listItems",
    },
  },
  itemsBas: {
    port: 30021,
    scope: "pvBasItems",
    module: {
      listItems: "./listItems",
    },
  },
  itemsPiscadaBas: {
    port: 30022,
    scope: "pvPiscadaBasItems",
    module: {
      listItems: "./listItems",
    },
  },
};

function getRemoteModuleConfig() {
  const res: {
    [key: string]: RemoteModuleConfig;
  } = {};
  Object.keys(RemoteModuleConfigObj).forEach((key) => {
    const { port, scope, module } = RemoteModuleConfigObj[key];
    res[key] = {
      ...RemoteModuleConfigObj[key],
      url: getUrl(HOST_NAME, port),
      baseUrl: getBaseUrl(HOST_NAME, port),
      remoteModule: createRemoteModule(port, scope, module),
    };
  });

  return res;
}

function getBaseUrlAndPort() {
  if (process.env.NEXT_PUBLIC_WEBPMP_V5_BASE_URL) {
    return process.env.NEXT_PUBLIC_WEBPMP_V5_BASE_URL + "/api/v1/";
  }

  if (typeof window !== "undefined") {
    const location = window.location;
    const baseUrl = `${location.protocol}//${location.hostname}:8000/api/v1/`;
    return baseUrl;
  }

  return "/";
}

function createRemoteModule(port: number, scope: string, module: Record<string, string>) {
  return {
    url: getUrl(HOST_NAME, port),
    baseUrl: getBaseUrl(HOST_NAME, port),
    scope,
    module,
  };
}

function getUrl(hostName: string, port: number) {
  return `${hostName}:${port}/_next/static/chunks/remoteEntry.js?`;
}

function getBaseUrl(hostName: string, port: number) {
  return `${hostName}:${port}`;
}

const AppConfig = {
  remoteModuleConfig: getRemoteModuleConfig(),
  baseURL: getBaseUrlAndPort(),
  userDataKey: "userData",
  storageTokenKey: "accessToken",
};

export default AppConfig;
