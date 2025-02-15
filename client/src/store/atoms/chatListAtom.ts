import { atom, selector } from "recoil";
export interface ChatObject {
  id: number;
  name: string;
}
export const chatListAtom = atom<ChatObject[] | string>({
  key: "chatListAtom",
  default: selector({
    key: "chatListSelector",
    get: async () => {
      const response = await fetch("http://localhost:4000/chat/getChats", {
        credentials: "include",
        headers: { authorization: "Bearer " + localStorage.getItem("jwt") },
      });

      const data = await response.json();
      if (!data.chats) {
        return data.msg;
      }
      return data.chats;
    },
  }),
});
