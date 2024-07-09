import dynamic from "next/dynamic";

const OverviewPage = dynamic(() => import("@/features/overview"), {
  ssr: false,
});

export default OverviewPage;
