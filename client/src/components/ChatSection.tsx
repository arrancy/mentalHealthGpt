import { useRecoilValueLoadable, useRecoilValue } from "recoil";
import { ifNewChatAtom } from "../store/atoms/ifNewChatAtom";
import { chatHistoryAtom } from "../store/atoms/chatHistoryAtom";
import { LoadingSpinner } from "./Loadingspinner";
import { Message } from "./Message";
import { ErrorMessage } from "./ErrorMessage";
import { errorTextAtom } from "../store/atoms/errorTextAtom";
import { TextInputArea } from "./TextInputArea";
import { useEffect, useRef } from "react";
import { LogoutButton } from "./LogoutButton";
import { LogoutModal } from "./LogoutModal";
import { isLogoutModalActiveAtom } from "../store/atoms/isLogoutModalActiveAtom";

export function ChatSection() {
  const ifNewChat = useRecoilValue(ifNewChatAtom);
  const chatHistory = useRecoilValueLoadable(chatHistoryAtom);
  const errorText = useRecoilValue(errorTextAtom);

  const bottomOfSectionRef = useRef<HTMLDivElement>(null);
  const isLogoutModalActive = useRecoilValue(isLogoutModalActiveAtom);

  useEffect(() => {
    if (bottomOfSectionRef.current) {
      bottomOfSectionRef.current.scrollIntoView();
    }
  }, [chatHistory]);

  return (
    <>
      <div className="bg-sky-200 w-full relative">
        <div
          className="h-full overflow-y-scroll pb-32 sm:px-32 pr-4 py-10 text-center transition-all ease-in-out duration-200 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-sky-300
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-sky-700 "
        >
          <LogoutButton></LogoutButton>
          {errorText && <ErrorMessage label={errorText}></ErrorMessage>}
          {isLogoutModalActive ? <LogoutModal></LogoutModal> : ""}
          {ifNewChat ? (
            <div className="font-semibold relative top-40 text-3xl text-sky-700 text-opacity-30 ">
              enter a message to start a chat
            </div>
          ) : chatHistory.state === "hasError" ? (
            <ErrorMessage label={chatHistory.contents.message}></ErrorMessage>
          ) : chatHistory.state === "loading" ? (
            <div className="flex h-full justify-center items-center">
              <LoadingSpinner></LoadingSpinner>
            </div>
          ) : (
            chatHistory.contents.map((message, index) => {
              return (
                <>
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "assistant"
                        ? "text-left justify-start"
                        : "text-right justify-end"
                    }`}
                  >
                    {
                      <Message
                        content={message.content}
                        role={message.role}
                        pending={message.pending}
                      ></Message>
                    }
                  </div>
                  <div ref={bottomOfSectionRef}></div>
                </>
              );
            })
          )}
        </div>
        <TextInputArea />
      </div>
    </>
  );
}
