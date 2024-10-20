import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type MdxFile = {
  id: number;
  title: string;
  category: string;
  content: string;
};

export const getAllMdxFilesWithContent = (directory: string): MdxFile[] => {
  const files = fs.readdirSync(directory);
  return files
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const fileContent = fs.readFileSync(path.join(directory, file), "utf-8");
      const { data, content } = matter(fileContent);
      return {
        id: data.id,
        title: data.title,
        category: data.category,
        content,
      };
    });
};
