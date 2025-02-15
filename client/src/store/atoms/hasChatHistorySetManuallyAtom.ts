import { atom } from "recoil";

export const hasChatHistorySetManuallyAtom = atom<boolean>({
  key: "hasChatHistorySetManuallyAtom",
  default: false,
});
