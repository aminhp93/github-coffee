"use client";

import supabase from "../supabase";
import { Post } from "./Post.types";

const PostService = {
  createPost(data: Partial<Post>) {
    return supabase.from("post").insert([data]).select();
  },
  listPost(params?: Partial<Post>) {
    const isDone = params && Object.hasOwn(params, "isDone");
    const tag = params && Object.hasOwn(params, "tag");
    // let authorQuery = 'author.is.null';
    // if (params?.author) {
    //   authorQuery = `author.is.null,author.eq.${params.author}`;
    // }

    return supabase.from("post").select();
    // .eq("author", params?.author)
    // .eq(isDone ? "isDone" : "", params?.isDone)
    // .eq(tag ? "tag" : "", params?.tag);
    // .or(authorQuery);
  },
  detailPost(postId: number) {
    return supabase.from("post").select().eq("id", postId);
  },
  updatePost(postId: number, data: Partial<Post>) {
    return supabase.from("post").update(data).eq("id", postId).select();
  },
  deletePost(postId: number) {
    return supabase.from("post").delete().eq("id", postId);
  },
};

export default PostService;
