import { ReactNode, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { Markdown } from "@/@core/utils/markdown";
import Link from "next/link";
import { axiosInstance } from "@/@core/services/http/axiosInstance";

const FeatureWrapper = ({
  children,
  featureName,
}: {
  children: ReactNode;
  featureName: string;
}) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [meta, setMeta] = useState<{
    title?: string;
    description?: string;
  }>({});

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance({
          method: "get",
          url: "/api/cors",
          params: {
            url: `https://raw.githubusercontent.com/aminhp93/github-coffee-docs/main/docs/features/${featureName}.md`,
          },
          baseURL: "/",
        });

        setMeta(res.data.data);
        setContent(res.data.content);
      } catch (error) {
        console.log("error", error);
        setError("Error");
      }
    })();
  }, [featureName]);

  const test = async () => {};

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Feature detail</Button>
      <Button onClick={() => test()}>test</Button>
      {children}

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {error && <div>error</div>}
        <h1>{meta.title}</h1>

        <Markdown>{content}</Markdown>
        <Link
          href={`https://github.com/aminhp93/github-coffee/edit/main/public/docs/features/${featureName}.md`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            bottom: 0,
          }}
        >
          Edit
        </Link>
      </Drawer>
    </div>
  );
};

export { FeatureWrapper };
