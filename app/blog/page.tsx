"use client";
import PostService from "@/@core/services/post/Post.service";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BlogPage = () => {
  // get all files in /content

  console.log("page blog");
  const router = useRouter();

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await PostService.listPost();
      console.log(data);
      setFiles(data as any);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Button onClick={() => router.push("/blog/create")}>Create</Button>
      <div>Blog page</div>
      {/* list all files  */}
      {files.map((file: any) => {
        return (
          <div key={file.id} onClick={() => router.push(`/blog/${file.id}`)}>
            {file.title}
          </div>
        );
      })}
    </div>
  );
};

export default BlogPage;
