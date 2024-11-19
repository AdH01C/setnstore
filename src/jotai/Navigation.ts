import { atom } from "jotai";

export type CurrentApplication = {
  appId: string;
  rulesetId: string;
};

export const currentApplicationAtom = atom<CurrentApplication>({
  appId: "",
  rulesetId: "",
});
