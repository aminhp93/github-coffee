import { importRemote } from "@module-federation/utilities";
import { ComponentType } from "react";

type RemoteModule = {
  default: ComponentType;
};

export const loadRemoteModule = async (
  url: string,
  scope: string,
  module: string
): Promise<ComponentType | null> => {
  try {
    const remoteModule = await importRemote({
      url: async () => Promise.resolve(url),
      scope,
      module,
    });

    return (remoteModule as RemoteModule).default;
  } catch (error) {
    return null;
  }
};
