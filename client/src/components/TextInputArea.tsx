import { MessageInputField } from "./MessageInputField";
import { Button } from "./Button";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentlyActiveChatAtom } from "../store/atoms/currentlyActiveChatAtom";
import { errorTextAtom } from "../store/atoms/errorTextAtom";
import { ifNewChatAtom } from "../store/atoms/ifNewChatAtom";
import {
  ChatHistoryObject,
  chatHistoryAtom,
} from "../store/atoms/chatHistoryAtom";
import { hasChatHistorySetManuallyAtom } from "../store/atoms/hasChatHistorySetManuallyAtom";
import { chatListAtom } from "../store/atoms/chatListAtom";
export function TextInputArea() {
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [ifActiveChat, setIfActiveChat] = useRecoilState(
    currentlyActiveChatAtom
  );

  const setErrorText = useSetRecoilState(errorTextAtom);
  const [ifNewChat, setIfNewChat] = useRecoilState(ifNewChatAtom);
  const setChatHistory = useSetRecoilState(chatHistoryAtom);
  const [hasChatHistorySetManually, setHasChatHistorySetManually] =
    useRecoilState(hasChatHistorySetManuallyAtom);
  const setChatList = useSetRecoilState(chatListAtom);

  const handleError = (errMessage: string) => {
    setErrorText(errMessage);
    setTimeout(() => {
      setErrorText("");
    }, 3000);
  };

  return (
    <>
      <div className="fixed bottom-0 sm:left-[33%] left-10 border-4 border-sky-800 sm:w-3/6 w-5/6 shadow-2xl rounded-lg mb-10 px-8 bg-sky-100 p-4 ">
        <div className="grid grid-cols-6 gap-4">
          <MessageInputField
            onChange={(event) => {
              setInputPrompt(event.target.value);
            }}
          ></MessageInputField>
          <Button
            label={"send"}
            onClick={
              ifNewChat
                ? async () => {
                    try {
                      if (!inputPrompt) {
                        return;
                      }
                      setIfNewChat(false);
                      setChatHistory([
                        {
                          id: null,
                          role: "user",
                          content: inputPrompt,
                          chatId: null,
                          pending: false,
                        },
                        {
                          id: null,
                          role: "assistant",
                          content: inputPrompt,
                          chatId: null,
                          pending: true,
                        },
                      ]);
                      if (!hasChatHistorySetManually) {
                        setHasChatHistorySetManually(true);
                      }

                      const response = await fetch(
                        "https://api.helpmymind.tech/chat/newChat",
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "authorization":
                              "Bearer " + localStorage.getItem("jwt"),
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ prompt: inputPrompt }),
                        }
                      );
                      if (!response.ok) {
                        const data = await response.json();
                        setErrorText(data.msg);

                        setTimeout(() => {
                          setErrorText("");
                        }, 3000);

                        setIfNewChat(true);
                      }
                      const data = await response.json();
                      const stateArray = data.content.map(
                        (messageObject: ChatHistoryObject) => {
                          return { ...messageObject, pending: false };
                        }
                      );
                      setChatHistory(stateArray);

                      setIfNewChat(false);

                      setChatList((prevList) => {
                        if (typeof prevList === "string") {
                          return [
                            { name: data.name, id: data.content[0].chatId },
                          ];
                        } else {
                          return [
                            { name: data.name, id: data.content[0].chatId },
                            ...prevList,
                          ];
                        }
                      });

                      setIfActiveChat({
                        key: data.content[0].chatId,
                      });
                    } catch (error) {
                      if (error instanceof Error) {
                        handleError(error.message);
                        if (error.message === "failed to fetch") {
                          handleError("server down, please try again later");
                        }
                      } else {
                        handleError("an unknown error occured");
                      }
                    }
                  }
                : async () => {
                    try {
                      setChatHistory((prevChatHistory) => [
                        ...prevChatHistory,
                        {
                          id: null,
                          role: "user",
                          content: inputPrompt,
                          chatId: null,
                          pending: false,
                        },
                        {
                          id: null,
                          role: "assistant",
                          content: "loading",
                          chatId: null,
                          pending: true,
                        },
                      ]);
                      if (!hasChatHistorySetManually) {
                        setHasChatHistorySetManually(true);
                      }
                      const response = await fetch(
                        "https://api.helpmymind.tech/chat/continueChat?chatId=" +
                          ifActiveChat.key,
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "authorization":
                              "Bearer " + localStorage.getItem("jwt"),
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ prompt: inputPrompt }),
                        }
                      );
                      if (!response.ok) {
                        const data = await response.json();
                        setErrorText(data.msg);
                        setTimeout(() => {
                          setErrorText("");
                        }, 3000);
                        return;
                      }
                      const data = await response.json();
                      const stateArray = data.content.map(
                        (message: ChatHistoryObject) => {
                          return { ...message, pending: false };
                        }
                      );

                      console.log(data);
                      setChatHistory((prevChatHistory) => {
                        const truncatedHistory = prevChatHistory.slice(0, -2);

                        return [...truncatedHistory, ...stateArray];
                      });
                    } catch (error) {
                      setChatHistory((prevHistory) => {
                        const historyWithoutNewMessages = prevHistory.slice(
                          0,
                          -2
                        );
                        return [...historyWithoutNewMessages];
                      });

                      if (error instanceof Error) {
                        handleError(error.message);
                        if (error.message === "failed to fetch") {
                          handleError("server down, please try again later");
                        }
                      } else {
                        handleError("an unknown error occured ");
                      }
                    }
                  }
            }
          ></Button>
        </div>
      </div>
    </>
  );
}
