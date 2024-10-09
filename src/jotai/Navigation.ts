import { atom } from "jotai";

export type CurrentlySelected = {
  type: string;
  appId?: string;
  companyId?: string;
};

export const currentlySelectedAtom = atom<CurrentlySelected>({
  type: "Dashboard",
});
