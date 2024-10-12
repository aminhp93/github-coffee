import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/features/home"), {
  ssr: false,
});

const HomePage = () => {
  return <Home />;
};

export default HomePage;
