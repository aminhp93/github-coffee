import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import {
  Home,
  FormatListBulleted,
  BugReport,
  EditNote,
  Abc,
  ShowChart,
} from "@mui/icons-material";

export enum STATUS {
  WORKING = "working",
  DONE = "done",
}

export const LIST_ALL_ROUTE: {
  key: string;
  url: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  status?: STATUS;
}[] = [
  {
    key: "home",
    url: "/",
    icon: Home,
    status: STATUS.WORKING,
  },
  {
    key: "list-repos",
    url: "/list-repos",
    icon: FormatListBulleted,
    status: STATUS.WORKING,
  },
  {
    key: "test",
    url: "/test",
    icon: BugReport,
    status: STATUS.WORKING,
  },
  {
    key: "stock",
    url: "/stock",
    icon: ShowChart,
    status: STATUS.WORKING,
  },
  {
    key: "overview",
    url: "/overview",
    icon: Abc,
    status: STATUS.WORKING,
  },
  {
    key: "blog",
    url: "/blog",
    icon: EditNote,
    status: STATUS.DONE,
  },
];
