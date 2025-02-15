import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentlyActiveChatAtom } from "../store/atoms/currentlyActiveChatAtom";
import { useEffect, useState } from "react";
import { hasChatHistorySetManuallyAtom } from "../store/atoms/hasChatHistorySetManuallyAtom";
import {
  chatHistoryAtom,
  getChatHistory,
} from "../store/atoms/chatHistoryAtom";
import { ifNewChatAtom } from "../store/atoms/ifNewChatAtom";
interface ChatNameProps {
  label: string;

  key: number;
  id: number;
}
export function ChatName({
  label,

  key,
  id,
}: ChatNameProps) {
  const [activeChat, setIfActiveChat] = useRecoilState(currentlyActiveChatAtom);
  const [ifIamActive, setIfIAmActive] = useState<boolean>(false);
  const setIfNewChat = useSetRecoilState(ifNewChatAtom);
  const hasChatHistorySetManually = useRecoilValue(
    hasChatHistorySetManuallyAtom
  );
  const setChatHistory = useSetRecoilState(chatHistoryAtom);
  useEffect(() => {
    setIfIAmActive(activeChat.key === id ? true : false);
  }, [activeChat, id]);
  return (
    <>
      <div
        onClick={async () => {
          setIfNewChat(false);

          if (!hasChatHistorySetManually) {
            setIfActiveChat({ key: id });
          } else {
            const chatHistory = await getChatHistory(id);
            setChatHistory(chatHistory);
            setIfActiveChat({ key: id });
          }
        }}
        key={key}
        className={
          "text-sky-900 cursor-pointer font-semibold my-1 bg-sky-100 text-lg p-1 rounded-md " +
          (ifIamActive
            ? " bg-sky-300 "
            : " hover:bg-sky-300 transition-all ease-in-out")
        }
      >
        {label}
      </div>
    </>
  );
}
