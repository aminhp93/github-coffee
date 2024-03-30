import { promises as fs } from "fs";
import Link from "next/link";

const BlogPage = async () => {
  // get all files in /content
  const files = await fs.readdir(process.cwd() + "/content");

  return (
    <div>
      <div>Blog page</div>
      {/* list all files  */}
      {files.map((file) => {
        return (
          <div key={file}>
            <Link href={`/blog/${file}`}>{file}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default BlogPage;
