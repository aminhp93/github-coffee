// Import libraries
import { useEffect, useState, ComponentType } from "react";

import { loadRemoteModule } from "./loadRemoteModule";
import AppConfig from "./app";

// Import local files

const ViewDetail = () => {
  const [loading, setLoading] = useState(false);
  const [RemoteComponent, setRemoteComponent] = useState<ComponentType | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { url, scope, module } =
        AppConfig.remoteModuleConfig.pvItems.remoteModule;
      setLoading(true);
      const res = await loadRemoteModule(url, scope, module.view);
      setLoading(false);
      setRemoteComponent(() => res as ComponentType);
    })();
  }, []);

  return (
    <div>
      {loading ? <div>Loading</div> : RemoteComponent && <RemoteComponent />}
    </div>
  );
};

export default ViewDetail;
