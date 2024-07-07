import dynamic from "next/dynamic";

const AppPage = dynamic(() => import("@/features/index"), {
  ssr: false,
});

export default AppPage;
