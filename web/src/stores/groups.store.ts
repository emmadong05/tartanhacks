import api from "@/shared/api";
import { create } from "zustand";


export type Tag = {
  _id: string;
  name: string;
  score: number;
}

export type Group = {
  _id: string;
  name: string;
  description: string;
  users: number[];
  tags: Tag[];
}


// Define the state interface
interface GroupState {
  groups: Group[];
  fetchGroups: () => Promise<void>;
}

// Create the store
const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  fetchGroups: async () => {
    api.get<Group[]>("groups").then((data) => {
      set({ groups: data });
    });
  }
}));

export default useGroupStore;