import { atom } from "jotai";

export type UserDetails = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyId: string;
    companyName: string;
    appId: string;
    rulesetId: string;
};

export const userDetailsAtom = atom<UserDetails>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    companyId: "",
    companyName: "",
    appId: "",
    rulesetId: "",
});