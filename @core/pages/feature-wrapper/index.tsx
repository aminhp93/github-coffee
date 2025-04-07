import { ReactNode, useEffect, useState } from "react";
import { Button, Drawer } from "@mui/material";
import matter from "gray-matter";
import Markdown from "react-markdown";
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

  const [meta, setMeta] = useState<{
    title?: string;
    description?: string;
    link?: string;
  }>({});

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    fetch(`/docs/features/${featureName}.md`)
      .then((res) => res.text())
      .then((raw) => {
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
        <h1>{meta.title}</h1>

        <Markdown>{content}</Markdown>
        <Link
          href={`https://github.com/aminhp93/github-coffee/edit/main/public/docs/features/${meta.link}.md`}
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
