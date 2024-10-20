// Import libraries
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { MdxFile } from "@/@core/utils/markdown";
import Box from "@mui/material/Box";
import Filter, { DEFAULT_LIST_CATEGORY } from "./Filter";

function renderTitle(file: MdxFile) {
  if (file.category === "Core") {
    return file.title;
  }
  return `[${file.category}] - ${file.title}`;
}

const Blog = () => {
  const [mdxFiles, setMdxFiles] = useState<MdxFile[]>([]);
  const [listCategory, setListCategory] = useState<string[]>(
    DEFAULT_LIST_CATEGORY
  );

  const [selectedMdx, setSelectedMdx] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const res = await axios.get("/api/blog/docs");
      setMdxFiles(res.data);
    };
    init();
  }, []);

  const renderSelected = () => {
    const selectedFile = mdxFiles.find((file) => file.id === selectedMdx);

    if (!selectedFile) {
      <div onClick={() => setSelectedMdx(null)}>Back</div>;
      return <Box>Not selected file</Box>;
    }

    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <div onClick={() => setSelectedMdx(null)}>Back</div>
          <Box>{selectedFile.title}</Box>
        </Box>

        <div>
          <Markdown>{selectedFile.content ?? ""}</Markdown>
        </div>
      </>
    );
  };

  return (
    <Box sx={{ overflow: "auto", height: "calc(100% - 20px)" }}>
      {selectedMdx !== null ? (
        renderSelected()
      ) : (
        <>
          <Filter
            listCategory={listCategory}
            setListCategory={setListCategory}
          />
          <ul>
            {mdxFiles
              .filter((file) => listCategory.includes(file.category))
              .map((file) => (
                <li key={file.id} onClick={() => setSelectedMdx(file.id)}>
                  <h2>{renderTitle(file)}</h2>
                </li>
              ))}
          </ul>
        </>
      )}
    </Box>
  );
};

export default Blog;
