import dynamic from "next/dynamic";

const Blog = dynamic(() => import("@/features/blog"), {
  ssr: false,
});

const BlogPage = () => {
  return <Blog />;
};

export default BlogPage;
