import { selector, atom } from "recoil";
import { currentlyActiveChatAtom } from "./currentlyActiveChatAtom";
export interface ChatHistoryObject {
  id: number | null;
  role: "user" | "assistant";
  content: string;
  chatId: number | null;
  pending: boolean;
}

interface ChatHistoryItem {
  id: number | null;
  role: "user" | "assistant";
  content: string;
  chatId: number | null;
}
export const getChatHistory = async (
  key: number
): Promise<ChatHistoryObject[]> => {
  const response = await fetch(
    "https://api.helpmymind.tech/chat/getChatHistory?chatId=" + key,
    {
      credentials: "include",
      headers: {
        "authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    }
  );
  const data = await response.json();
  const stateArray = data.chatHistory.map((message: ChatHistoryItem) => {
    return { ...message, pending: false };
  });

  return stateArray;
};

export const chatHistoryAtom = atom<ChatHistoryObject[]>({
  key: "chatHistoryAtom",
  default: selector({
    key: "chatHistorySelector",
    get: async ({ get }) => {
      const currentlyActiveChat = get(currentlyActiveChatAtom);
      const { key } = currentlyActiveChat;
      if (!key) {
        return [];
      }
      const stateArray = await getChatHistory(key);
      return stateArray;
    },
  }),
});
