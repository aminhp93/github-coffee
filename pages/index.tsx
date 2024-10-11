import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/features/home/Dashboard"), {
  ssr: false,
});

const HomePage = () => {
  return <Home />;
};

export default HomePage;
