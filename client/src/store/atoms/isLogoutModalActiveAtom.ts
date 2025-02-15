import { atom } from "recoil";

export const isLogoutModalActiveAtom = atom<boolean>({
  key: "isLogoutModalActiveAtom",
  default: false,
});
