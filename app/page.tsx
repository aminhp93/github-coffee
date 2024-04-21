import dynamic from "next/dynamic";

const AppPage = dynamic(() => import("./AppPage"), {
  ssr: false,
});

export default AppPage;
