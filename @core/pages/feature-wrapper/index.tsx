import { ReactNode, useEffect, useState } from "react";
import { Button, Drawer } from "@mui/material";
import matter from "gray-matter";
import Markdown from "react-markdown";

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
        <p>{meta.description}</p>
        <Markdown>{content}</Markdown>
      </Drawer>
    </div>
  );
};

export { FeatureWrapper };
