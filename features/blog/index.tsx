// Import libraries
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";

interface MdxFile {
  filename: string;
  content: string;
  id: number;
}

const Blog = () => {
  const [mdxFiles, setMdxFiles] = useState<MdxFile[]>([]);
  const [selectedMdx, setSelectedMdx] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const res = await axios.get("/api/blog/docs");
      setMdxFiles(res.data);
    };
    init();
  }, []);

  return (
    <div>
      {selectedMdx !== null ? (
        <>
          <div onClick={() => setSelectedMdx(null)}>Back</div>
          <div>
            <Markdown>
              {mdxFiles.filter((i) => i.id === selectedMdx)[0].content ?? ""}
            </Markdown>
          </div>
        </>
      ) : (
        <ul>
          {mdxFiles.map((file) => (
            <li key={file.filename} onClick={() => setSelectedMdx(file.id)}>
              <h2>{file.filename}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blog;
