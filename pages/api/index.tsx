import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

interface MdxFile {
  filename: string;
  content: string;
  id: number;
}

const getAllMdxFilesWithContent = (directory: string): MdxFile[] => {
  const files = fs.readdirSync(directory);
  return files
    .filter((file) => path.extname(file) === ".mdx")
    .map((file, index) => {
      const content = fs.readFileSync(path.join(directory, file), "utf-8");
      return { id: index + 1, filename: file, content };
    });
};

type ResponseData = MdxFile[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const mdxFiles = getAllMdxFilesWithContent(
    path.join(process.cwd(), "features/blog")
  );
  res.status(200).json(mdxFiles);
}
