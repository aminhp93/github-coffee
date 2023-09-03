// import { ViewPV } from "../../../../../@/components/view/View.schema";
type ViewPV = any;

export type ProcessViewInfo = {
  chainId: string;
  description: string;
  groups: string;
  name: string;
  path: string;
  subSystem: string;
  type: string;
  uuid: string;
};

export type ProcessViewResponse = {
  data: ProcessViewInfo[];
  msgData: {
    chain: string;
    skipContent: boolean;
    skipThumbnail: boolean;
  };
};

export interface ViewInfo extends ViewPV {
  processViewInfo: ProcessViewInfo;
  status?: "success" | "failure";
}
