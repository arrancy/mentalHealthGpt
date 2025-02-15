import { atom } from "recoil";

export const errorTextAtom = atom<string>({
  key: "errorTextAtom",
  default: "",
});
