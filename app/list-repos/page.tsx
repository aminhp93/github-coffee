import dynamic from "next/dynamic";

const AppPage = dynamic(() => import("@/features/list-repos/ListRepos"), {
  ssr: false,
});

export default AppPage;
