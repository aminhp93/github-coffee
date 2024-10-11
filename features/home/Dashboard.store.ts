import { produce } from "immer";
import { create } from "zustand";
import { Dashboard } from "./Dashboard.types";

type DashboardStore = {
  dashboards: Dashboard[] | undefined;
  setDashboards: (dashboards: Dashboard[]) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
};

const useDashboardStore = create<DashboardStore>((set) => ({
  dashboards: undefined,
  setDashboards: (dashboards: Dashboard[]) =>
    set(
      produce((draft) => {
        draft.dashboards = dashboards;
      })
    ),
  editMode: false,
  setEditMode: (mode: boolean) =>
    set(
      produce((draft) => {
        draft.editMode = mode;
      })
    ),
}));

export default useDashboardStore;
