import { promises as fs } from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";

const DetailBlog = async (props: any) => {
  const id = props.params.id;
  const file = await fs.readFile(process.cwd() + `/content/${id}`, "utf8");

  return (
    <div>
      <div>Detail Blog</div>
      <MDXRemote source={file} />
    </div>
  );
};

export default DetailBlog;
