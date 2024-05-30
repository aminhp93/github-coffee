"use client";

import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useState } from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import PostService from "@/@core/services/post/Post.service";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

export default function CreatePage() {
  const [title, setTitle] = useState("title");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "heading",
        content: "This is a heading block",
      },
      {
        type: "paragraph",
        content: "This is a paragraph block",
      },
      {
        type: "paragraph",
      },
    ],
  });

  const [blocks, setBlocks] = useState<Block[]>(editor.document);

  const handleSave = async () => {
    try {
      const requestData = {
        title,
        content: blocks,
        author: "7b23df42-324e-4f19-8f81-14355e7704d9",
      };
      setLoading(true);
      const res: any = await PostService.createPost(requestData as any);
      setLoading(false);
      enqueueSnackbar("Post created", { variant: "success" });
      setTimeout(() => {
        router.push(`/blog/${res.data[0].id}`);
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Failed to create post", { variant: "error" });

      console.log(error);
    }
  };

  const handleChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  return (
    <div className={"wrapper"}>
      <Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button onClick={() => handleSave()}>Save</Button>
        )}

        <Button onClick={() => router.push("/blog")}>Cancel</Button>
      </Box>
      <div className={"item"}>
        <TextField onChange={handleChangeTitle} />
        <BlockNoteView
          editor={editor}
          onChange={() => {
            setBlocks(editor.document);
          }}
        />
      </div>
    </div>
  );
}
