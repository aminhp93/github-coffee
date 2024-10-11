import { MDXProvider } from "@mdx-js/react";
import Doc from "./doc.mdx";

const News = () => {
  return (
    <MDXProvider>
      <div>
        News
        <Doc />
      </div>
    </MDXProvider>
  );
};

export default News;
