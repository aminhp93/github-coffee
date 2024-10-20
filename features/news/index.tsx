import axios from "axios";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MdxFile } from "@/@core/utils/markdown";

const News = () => {
  const [mdxFiles, setMdxFiles] = useState<MdxFile[]>([]);

  useEffect(() => {
    const init = async () => {
      const res = await axios.get("/api/news/docs");
      setMdxFiles(res.data);
    };
    init();
  }, []);

  return (
    <div>
      News
      <Markdown remarkPlugins={[remarkGfm]}>
        {mdxFiles[0]?.content ?? ""}
      </Markdown>
    </div>
  );
};

export default News;
