/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CustomCellRendererProps } from "ag-grid-react";

import {
  LeakRemove,
  NotificationsActive,
  NotificationsOff,
  PanTool,
  SyncDisabled,
  Warning,
} from "@mui/icons-material";
import i18next from "i18next";

const USER_COLUMN_DEFS = [
  "statusIcon",
  "name",
  "description",
  "statusText",
  "facility",
  "path",
];

export const DEFAULT_COL_DEFS = USER_COLUMN_DEFS.map((colDef) => {
  return {
    field: colDef,
    cellRenderer: (params: CustomCellRendererProps) => {
      return getTableCellValue(params.data, params.colDef?.field);
    },
  };
});

const getTableCellValue = (tag: any, column: any) => {
  switch (column) {
    case "statusText":
      return getStatusText(tag.statusFlags);
    case "statusIcon":
      return getStatusIcon(tag.statusFlags);
    default:
      return tag[column];
  }
};

const getStatusText = (statusFlags: any) => {
  const status = [
    ...(statusFlags?.bacnet?.map((status: any) =>
      i18next.t(BacnetStatus[status])
    ) ?? []),
    ...(statusFlags?.piscada?.map((status: any) =>
      i18next.t(PiscadaStatus[status])
    ) ?? []),
  ];

  return status.length <= 0 ? i18next.t("none") : status.join(", ");
};

/* The value is the Descriptive Name and using i18next keyword */
export const BacnetStatus: any = {
  InAlarm: "in_alarm",
  Fault: "fault",
  Override: "override",
  OutOfService: "out_of_service",
};

/* The value is the Descriptive Name and using i18next keyword */
export const PiscadaStatus: any = {
  InAlarm: "alarm",
  AlarmSuspended: "alarm_suspended",
  Offline: "offline",
  Override: "override",
  OutOfService: "out_of_service",
};

const getStatusIcon = (statusFlags: any) => {
  const statusList = [
    ...(statusFlags?.bacnet ?? []),
    ...(statusFlags?.piscada ?? []),
  ];

  const icons = statusList.map((status) => {
    const iconKey = `status-${status}`;
    switch (status) {
      case "InAlarm":
        return <NotificationsActive key={iconKey} />;
      case "AlarmSuspended":
        return <NotificationsOff key={iconKey} />;
      case "Offline":
        return <LeakRemove key={iconKey} />;
      case "Override":
        return <PanTool key={iconKey} />;
      case "OutOfService":
        return <SyncDisabled key={iconKey} />;
      case "Fault":
        return <Warning key={iconKey} />;
      default:
        return "";
    }
  });

  return icons;
};
