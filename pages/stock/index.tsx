import dynamic from "next/dynamic";

const Stock = dynamic(() => import("@/features/stock"), {
  ssr: false,
});

const StockPage = () => {
  return <Stock />;
};

export default StockPage;
