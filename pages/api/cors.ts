// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import matter from "gray-matter";

type Data = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // get url from query
  const { url } = req.query;

  // Ensure url is a string
  if (typeof url !== "string") {
    return res.status(400).json({ name: "Error", data: "Invalid URL" });
  }

  try {
    // Send API GET request
    const res2 = await axios({
      method: "get",
      url: url,
    });

    const { data, content } = matter(res2.data);

    res.status(200).json({ name: "John Doe", data, content });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ name: "Error" });
  }
}
