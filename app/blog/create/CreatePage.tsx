"use client";

import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import PostService from "@/@core/services/post/Post.service";
import { useRouter } from "next/navigation";

export default function App() {
  // Stores the document JSON.
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("title");
  const router = useRouter();

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

  const handleSave = async () => {
    try {
      // Saves the document JSON to a database or API.
      console.log(blocks);
      const requestData = {
        title,
        content: blocks,
        author: "7b23df42-324e-4f19-8f81-14355e7704d9",
      };
      await PostService.createPost(requestData as any);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTitle = (e: any) => {
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  console.log("page detail");

  // Renders the editor instance and its document JSON.
  return (
    <div className={"wrapper"}>
      <Box>
        <Button onClick={() => handleSave()}>Save</Button>
        <Button onClick={() => router.push("/blog")}>Cancel</Button>
      </Box>
      <div className={"item"}>
        <TextField onChange={handleChangeTitle} />
        <BlockNoteView
          editor={editor}
          onChange={() => {
            // Saves the document JSON to state.
            setBlocks(editor.document);
          }}
        />
      </div>
    </div>
  );
}
