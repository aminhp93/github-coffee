import { create } from "zustand";
import { produce } from "immer";

export type RepoStore = {
  selectedRepo: any;
  setSelectedRepo: (data: any) => void;
};

export const useRepoStore = create<RepoStore>((set) => ({
  selectedRepo: null,
  setSelectedRepo: (data) =>
    set(
      produce((state) => {
        state.selectedRepo = data;
      })
    ),
}));
