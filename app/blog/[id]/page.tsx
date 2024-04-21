"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect, useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import PostService from "@/@core/services/post/Post.service";
import { useRouter, useParams } from "next/navigation";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";

export default function App() {
  // GET ID from url
  const router = useRouter();
  const params = useParams();
  console.log(params);
  const { id } = params;

  // Stores the document JSON.
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  // Creates a new editor instance.
  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await PostService.detailPost(id as any);
      console.log(data);
      setInitialContent(JSON.parse((data as any)[0].content));
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    // Saves the document JSON to a database or API.
    console.log(blocks);
    const requestData = {
      content: JSON.stringify(blocks),
    };

    await PostService.updatePost(id as any, requestData);

    setIsEditing(false);
  };

  console.log("page detail", blocks);

  if (editor === undefined) {
    return "Loading content...";
  }

  // Renders the editor instance and its document JSON.
  return (
    <div className={"wrapper"}>
      <Box>
        {isEditing ? (
          <>
            <Button onClick={() => handleSave()}>Save</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </Box>
      <div className={"item"}>
        <BlockNoteView
          editable={isEditing}
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
