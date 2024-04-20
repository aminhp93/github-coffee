import { promises as fs } from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";

const DetailBlog = async (props: any) => {
  const id = props.params.id;
  const file = await fs.readFile(
    process.cwd() + `/public/content/${id}`,
    "utf8"
  );
  // seem like it does not work. get error path: '/var/task/content/github-coffee-problem-1.mdx'

  return (
    <div>
      <div>Detail Blog</div>
      <MDXRemote source={file} />
    </div>
  );
};

export default DetailBlog;
