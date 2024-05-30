"use client";
// Import libraries
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box, Button, Divider } from "@mui/material";

// Import local files
import PostService from "@/@core/services/post/Post.service";

const BlogPage = () => {
  const router = useRouter();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await PostService.listPost();
        setLoading(false);
        setFiles(data as any);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    })();
  }, []);

  return (
    <Box>
      <Button onClick={() => router.push("/blog/create")}>Create</Button>
      {loading ? (
        <CircularProgress />
      ) : (
        files.map((file: any) => {
          return (
            <Box key={file.id} onClick={() => router.push(`/blog/${file.id}`)}>
              {file.id} - {file.title}
              <Divider />
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default BlogPage;
