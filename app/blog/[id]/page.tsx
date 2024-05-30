"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect, useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import PostService from "@/@core/services/post/Post.service";
import { useParams } from "next/navigation";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function BlogDetail() {
  // GET ID from url
  const params = useParams();
  const router = useRouter();

  const { id } = params;
  const [loading, setLoading] = useState(false);

  // Stores the document JSON.
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState("");
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
    (async () => {
      try {
        setLoading(true);
        const { data } = await PostService.detailPost(id as any);
        setInitialContent(JSON.parse((data as any)[0].content));
        setTitle((data as any)[0].title);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    try {
      const requestData = {
        content: JSON.stringify(blocks),
      };

      await PostService.updatePost(id as any, requestData);

      setIsEditing(false);
      enqueueSnackbar("Post saved", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("Failed to update post", { variant: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(id as any);
      setIsDeleting(false);
      enqueueSnackbar("Post deleted", { variant: "success" });
      setTimeout(() => {
        router.push(`/blog`);
      });
    } catch (e) {
      enqueueSnackbar("Failed to delete post", { variant: "error" });
    }
  };

  if (editor === undefined || loading) {
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
        {isDeleting ? (
          <>
            <Button onClick={() => handleDelete()}>Delete</Button>
            <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsDeleting(true)}>Delete</Button>
          </>
        )}
      </Box>
      <div className={"item"}>
        <Box>{title}</Box>
        <BlockNoteView
          editable={isEditing}
          editor={editor}
          onChange={() => {
            setBlocks(editor.document);
          }}
        />
      </div>
    </div>
  );
}
