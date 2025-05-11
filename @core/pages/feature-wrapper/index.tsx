import { ReactNode, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import matter from "gray-matter";
import { Markdown } from "@/@core/utils/markdown";
import Link from "next/link";

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
    fetch(`/docs/features/${featureName}.md`)
      .then((res) => {
        if (!res.ok) {
          setError("error");
          // throw new Error("Network response was not ok");
          return Promise.reject("Network response was not ok");
        }
        return res.text();
      })
      .then((raw) => {
        console.log("raw", raw);
        const { data, content: mdContent } = matter(raw);

        setMeta(data);
        setContent(mdContent);
      });
  }, [featureName]);

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Feature detail</Button>
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
