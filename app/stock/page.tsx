import dynamic from "next/dynamic";

const StockPage = dynamic(() => import("@/features/stock"), {
  ssr: false,
});

export default StockPage;
