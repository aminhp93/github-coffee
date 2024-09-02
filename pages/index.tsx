import dynamic from "next/dynamic";

const ViewDetail = dynamic(() => import("@/features/view"), {
  ssr: false,
});

const HomePage = () => {
  return <ViewDetail />;
};

export default HomePage;
