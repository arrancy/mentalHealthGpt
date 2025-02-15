import { atom } from "recoil";

export const isSidebarOpenAtom = atom<boolean>({
  key: "isSidebarOpenAtom",
  default: false,
});
