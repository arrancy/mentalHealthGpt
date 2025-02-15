import { atom } from "recoil";

export const ifNewChatAtom = atom<boolean>({
  key: "ifNewChatAtom",
  default: true,
});
