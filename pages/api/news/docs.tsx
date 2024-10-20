import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { MdxFile, getAllMdxFilesWithContent } from "@/@core/utils/markdown";

type ResponseData = MdxFile[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const mdxFiles = getAllMdxFilesWithContent(
    path.join(process.cwd(), "docs/news")
  );
  res.status(200).json(mdxFiles);
}
