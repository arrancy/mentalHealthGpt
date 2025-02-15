import { atom } from "recoil";
interface CurrentlyActiveChatAtom {
  key: number | null;
}

export const currentlyActiveChatAtom = atom<CurrentlyActiveChatAtom>({
  key: "currentlyActiveChatAtom",
  default: { key: null },
});
