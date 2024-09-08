// Import libraries
import { useEffect, useState, ComponentType } from "react";

// Import local files
import { loadRemoteModule } from "@/@core/utils/loadRemoteModule";
import AppConfig from "@/@core/utils/app";

const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [RemoteComponent, setRemoteComponent] = useState<ComponentType | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { url, scope, module } =
        AppConfig.remoteModule["github-coffee-blog"];
      setLoading(true);
      const res = await loadRemoteModule(url, scope, module.index);
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

export default Blog;
