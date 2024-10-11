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
      try {
        const { url, scope, module } =
          AppConfig.remoteModule["github-coffee-blog"];
        setLoading(true);
        const res = await loadRemoteModule(url, scope, module.index);
        setLoading(false);
        setRemoteComponent(() => res as ComponentType);
      } catch (error) {
        // console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      {loading ? <div>Loading</div> : null}
      {RemoteComponent ? (
        <RemoteComponent />
      ) : (
        <div>github-coffee-blog RemoteComponent Error</div>
      )}
    </div>
  );
};

export default Blog;
