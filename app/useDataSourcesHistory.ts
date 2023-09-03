// import { useQuery } from "react-query";
// import useDataSourceVariables from "../../hooks/useDataSourceVariables";
// import { selectViewChainId } from "../../utils/deprecated/selectViewChainId";
// import { useMeterGroupList } from "../MeterGroups/useMeterGroups";
// import getDataSourceHistory from "./api/getDataSourceHistory";
// import { DataSource } from "./utils/DataSourceSchema";

// export interface DataSourcesHistoryOptions {
// 	dataSources?: DataSource[];
// 	interval?: string;
// 	from?: string;
// 	to?: string;
// }

// const useDataSourcesHistory = ({ dataSources, interval, from, to }: DataSourcesHistoryOptions) => {
// 	const currentControllerId = selectViewChainId();
// 	const [meterGroups] = useMeterGroupList(currentControllerId);
// 	const { variables } = useDataSourceVariables();

// 	const listKey = dataSources?.map(i => {
// 		switch (i.type) {
// 			case "variable": {
// 				const value = i.value;
// 				return value && variables[value]
// 					? `data-sources-history-${variables[value]?.uuid}`
// 					: "data-sources-history";
// 			}
// 		}
// 		return "data-sources-history";
// 	});

// 	return useQuery(
// 		[listKey, dataSources, interval, from, to],
// 		() =>
// 			getDataSourceHistory({
// 				dataSources,
// 				interval,
// 				from,
// 				to,
// 				context: { meterGroups, variables },
// 			}),
// 		{
// 			enabled: dataSources?.length > 0,
// 			staleTime: Infinity,
// 			retry: false,
// 		}
// 	);
// };

// export default useDataSourcesHistory;

import { useQuery } from "react-query";

const useDataSourcesHistory = (id: string) => {
  return useQuery(
    [`id-${id}`],
    () =>
      new Promise(async (resolve) => {
        // wait 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // random number between 0 and 100
        const random = Math.floor(Math.random() * 100);
        resolve(`hello world ${random}`);
      }),
    {
      enabled: true,
      staleTime: Infinity,
      retry: false,
    }
  );
};

export default useDataSourcesHistory;
