import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { chatListAtom } from "../store/atoms/chatListAtom";
import logoImage from "../images/mentalHealthGpt logo-photoaidcom-cropped.png";
import { ifNewChatAtom } from "../store/atoms/ifNewChatAtom";
import { Newchat } from "./NewChat";
import { ChatListSkeleton } from "./ChatListSkeleton";
import { ChatName } from "./ChatName";
import { currentlyActiveChatAtom } from "../store/atoms/currentlyActiveChatAtom";
import { ErrorMessage } from "./ErrorMessage";
import { isSidebarOpenAtom } from "../store/atoms/isSidebarOpenAtom";

export function ChatListSection() {
  const chatList = useRecoilValueLoadable(chatListAtom);
  const setIfNewChat = useSetRecoilState(ifNewChatAtom);
  const setIfActiveChat = useSetRecoilState(currentlyActiveChatAtom);
  const isSidebarOpen = useRecoilValue(isSidebarOpenAtom);

  return (
    <>
      <div
        className={`bg-sky-100 sm:w-1/5 sm:px-2 py-4 overflow-y-scroll  transition-all ease-in-out duration-200 sm:translate-x-0 ${
          !isSidebarOpen ? `-translate-x-full w-0` : `translate-x-0  z-40 `
        }  [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-sky-300
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-sky-700`}
      >
        <div className=" pl-2 gap-1 hidden sm:visible sm:pl-5 sm:flex sm:gap-4">
          <div className="font-bold text-sky-900 text-lg">
            mental health GPT
          </div>
          <div>
            <img
              src={logoImage}
              className="relative top-1 w-5 h-5 bg-sky-100"
            ></img>
          </div>
        </div>
        <Newchat
          onClick={() => {
            setIfNewChat(true);
            setIfActiveChat({ key: null });
          }}
        ></Newchat>
        {chatList.state === "loading" ? (
          <ChatListSkeleton></ChatListSkeleton>
        ) : chatList.state === "hasValue" &&
          !(typeof chatList.contents === "string") ? (
          chatList.contents.map((chat, index) => {
            return (
              <ChatName label={chat.name} key={index} id={chat.id}></ChatName>
            );
          })
        ) : chatList.state === "hasError" ? (
          <ErrorMessage label={chatList.contents.message}></ErrorMessage>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
