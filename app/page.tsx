"use client";

import useDataSourcesHistory from "./useDataSourcesHistory";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {["1", "2", "3", "1", "1"].map((i, index) => {
          return <Tag id={i} key={index} />;
        })}
      </div>
    </QueryClientProvider>
  );
};

export default Home;

const Tag = ({ id }: { id: string }) => {
  const { data } = useDataSourcesHistory(id);
  console.log(data);
  return <div>{data as string}</div>;
};
