import { atom } from "jotai";

export type CurrentlySelected = {
  type: string;
  appId?: string;
  companyName?: string;
};

export const currentlySelectedAtom = atom<CurrentlySelected>({
  type: "Dashboard",
});
