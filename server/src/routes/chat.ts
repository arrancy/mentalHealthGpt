import express, { Router, Request, Response } from "express";
import { isLoggedIn } from "../auth/authMiddleware";
import { CustomRequest } from "../auth/auth";
import { newchatSchema } from "../zodTypes/zodNewchatSchema";
import Groq from "groq-sdk";
import { db } from "..";
import { chatsTable, messagesTable } from "../db/schema";
import { zodContinueChatSchema } from "../zodTypes/zodContinueChatSchema";
import { eq } from "drizzle-orm";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
export const chatRouter = Router();
chatRouter.use(express.json());
const groq = new Groq({ apiKey: process.env.API_KEY });
const systemPromptObject = {
  role: "system",
  content:
    "You are a mental health assistant. Your primary objective is to provide compassionate, respectful, and evidence-based mental health support. Please follow these guidelines:\n\n1. Mental Health-Related Queries:\n   - If the user’s prompt relates to mental health (e.g., questions about anxiety, depression, stress, coping strategies, etc.), provide accurate and supportive information.\n   - Always include a disclaimer such as: 'I am not a licensed therapist, and my advice is not a substitute for professional care.'\n   - When appropriate, offer names or links to reputable, free mental health resources.\n\n2. Non-Mental Health Queries:\n   - If the user’s prompt is not related to mental health, respond with exactly: 'Please ask questions related to mental health.'\n\n3. Signs of Distress or Crisis:\n   - If the user’s prompt indicates distress, crisis, or self-harm risk, respond immediately with empathetic support.\n   - Advise the user to seek professional help and, if in immediate danger, to contact their local emergency services immediately.\n   - Provide a list of free and reputable crisis intervention resources (e.g., crisis hotline numbers and trusted online support sites) relevant to the user’s region if known.\n\nEnsure that your tone remains empathetic and non-judgmental while strictly following these guidelines.",
};

chatRouter.post("/newChat", isLoggedIn, async (req: Request, res: Response) => {
  const newReq = req as CustomRequest;
  const userId = newReq.user.id;
  const reqBody = newReq.body;
  const { success } = newchatSchema.safeParse(reqBody);
  if (!success) {
    res.status(401).json({ msg: "invalid inputs" });
    return;
  }
  const { prompt } = reqBody;
  async function getGroqChatCompletion() {
    return groq.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content":
            "You are a mental health assistant. Your primary objective is to provide compassionate, respectful, and evidence-based mental health support. Please follow these guidelines:\n\n1. Mental Health-Related Queries:\n   - If the user’s prompt relates to mental health (e.g., questions about anxiety, depression, stress, coping strategies, etc.), provide accurate and supportive information.\n   - Always include a disclaimer such as: 'I am not a licensed therapist, and my advice is not a substitute for professional care.'\n   - When appropriate, offer names or links to reputable, free mental health resources.\n\n2. Non-Mental Health Queries:\n   - If the user’s prompt is not related to mental health, respond with exactly: 'Please ask questions related to mental health.'\n\n3. Signs of Distress or Crisis:\n   - If the user’s prompt indicates distress, crisis, or self-harm risk, respond immediately with empathetic support.\n   - Advise the user to seek professional help and, if in immediate danger, to contact their local emergency services immediately.\n   - Provide a list of free and reputable crisis intervention resources (e.g., crisis hotline numbers and trusted online support sites) relevant to the user’s region if known.\n\nEnsure that your tone remains empathetic and non-judgmental while strictly following these guidelines.",
        },
        {
          "role": "user",
          "content":
            "This is the first message in our conversation and it has two parts: an instruction for formatting your response and the actual prompt for you to answer.\n\nFor this first message, please follow these instructions:\n\n1. **Response Format:** Respond strictly in JSON format with exactly two fields:\n   - **chatName:** A short name for the chat based on the prompt provided later. The name should be a maximum of three words (ideally two words).\n   - **response:** Your answer to the given prompt.\n\n2. **Formatting Requirement:** Your JSON response should start directly with an opening curly brace `{` (do not prefix your response with any extra text such as 'json').\n\n3. **Subsequent Messages:** After this initial JSON response, you may reply in your normal style to any further messages.\n\nHere is the given prompt: " +
            prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
  }

  async function main() {
    try {
      const chatCompletion = await getGroqChatCompletion();
      const firstMessage = chatCompletion.choices[0].message.content;

      if (!firstMessage) {
        return res.status(500).json({ msg: "internal server error" });
      }

      const firstMessageSanitized = firstMessage
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .trim();
      const firstMessageObject = JSON.parse(firstMessageSanitized);
      const { chatName, response } = firstMessageObject;
      const chatObject = { name: chatName, userId };
      const newChat = await db
        .insert(chatsTable)
        .values(chatObject)
        .returning();

      if (!newChat) {
        return res.status(500).json({ msg: "error creating new chat " });
      }

      const chatId = newChat[0].id;
      const { name } = newChat[0];
      const userMessageObject = { content: prompt, chatId, role: "user" };
      const userMessage = await db
        .insert(messagesTable)
        .values(userMessageObject)
        .returning();
      const newMessageObject = { content: response, chatId, role: "assistant" };
      const newMessage = await db
        .insert(messagesTable)
        .values(newMessageObject)
        .returning();
      const userPrompt = userMessage[0];
      const responseMessage = newMessage[0];

      res.status(200).json({ content: [userPrompt, responseMessage], name });
      return;
    } catch (error) {
      console.log(error);
      return res.status(500).json("an unknown error occured");
    }
  }

  await main();
  return;
});

chatRouter.get("/getChats", isLoggedIn, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(500).json();
    return;
  }

  try {
    const userExists = await db.query.usersTable.findFirst({
      where: (table, { eq }) => eq(table.id, userId),
    });

    if (!userExists) {
      res.status(401).json({ msg: "unauthorized" });
      return;
    }
    const chats = await db.query.chatsTable.findMany({
      where: eq(chatsTable.userId, userId),
    });

    if (!chats) {
      res.status(404).json({ msg: "chats not found" });
    }

    const chatArrayToSend = chats.map((chat) => {
      const { id, name } = chat;
      return { id, name };
    });
    res.status(200).json({
      msg: "chats fetched successfully",
      chats: chatArrayToSend.reverse(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "an unknown error occured " });
  }
});

chatRouter.get(
  "/getChatHistory",
  isLoggedIn,
  async (req: Request, res: Response) => {
    const queryParamsObject = req.query;
    const { success } = zodContinueChatSchema.safeParse(queryParamsObject);
    if (!success) {
      res.status(401).json({ msg: "invalid inputs" });

      return;
    }
    const chatIdString = queryParamsObject.chatId;
    if (!(typeof chatIdString === "string")) {
      res.status(401).json({ msg: "invalid inputs" });
      return;
    }
    try {
      const chatId = parseInt(chatIdString);
      const chatHistory = await db.query.messagesTable.findMany({
        where: eq(messagesTable.chatId, chatId),
      });
      if (!chatHistory) {
        res.status(404).json({ msg: "no chats found " });
        return;
      }
      res
        .status(200)
        .json({ msg: "chat history fetched successfully", chatHistory });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "an unknown error occured" });
      return;
    }
  }
);

chatRouter.post(
  "/continueChat",
  isLoggedIn,
  async (req: Request, res: Response) => {
    const queryParamsObject = req.query;
    const { success } = zodContinueChatSchema.safeParse(queryParamsObject);
    if (!success) {
      res.status(401).json({ msg: " invalid inputs" });
      return;
    }
    const chatIdString = queryParamsObject.chatId;

    if (!(typeof chatIdString === "string")) {
      res.status(401).json({ msg: " invalid inputs" });
      return;
    }
    try {
      const chatId = parseInt(chatIdString);
      const validChat = await db.query.chatsTable.findFirst({
        where: (table, { eq }) => eq(table.id, chatId),
      });
      if (!validChat) {
        res.status(401).json({ msg: "invalid inputs" });
        return;
      }
      const rawMessagesArray = await db.query.messagesTable.findMany({
        where: eq(messagesTable.chatId, chatId),
      });
      const messagesArray = rawMessagesArray.map((messageElement) => {
        const { role, content } = messageElement;

        return { role, content };
      });

      const systemPromptArray = [systemPromptObject];
      const newReq = req as CustomRequest;
      const reqBody = newReq.body;
      const { success } = newchatSchema.safeParse(reqBody);
      if (!success) {
        res.status(401).json({ msg: "invalid inputs" });
        return;
      }
      const { prompt } = reqBody;

      const newestMessageObject = { role: "user", content: prompt };
      const arrayToSend = [
        ...systemPromptArray,
        ...messagesArray,
        newestMessageObject,
      ];
      const promptInDatabase = await db
        .insert(messagesTable)
        .values({ role: "user", content: prompt, chatId })
        .returning();

      async function getGroqChatCompletion() {
        return groq.chat.completions.create({
          messages: arrayToSend as ChatCompletionMessageParam[],
          model: "llama-3.3-70b-versatile",
        });
      }
      async function main() {
        try {
          const chatCompletion = await getGroqChatCompletion();
          // Print the completion returned by the LLM.

          const { role } = chatCompletion.choices[0].message;
          const response = chatCompletion.choices[0].message.content;
          if (!response) {
            res.status(500).json({ msg: "could not get response" });
            return;
          }
          const responseInDataBase = await db
            .insert(messagesTable)
            .values({ role, chatId, content: response })
            .returning();
          if (!responseInDataBase) {
            res.status(500).json({ msg: "an unknown error occured" });
          }

          res.status(200).json({
            msg: "recieved response successfully",
            content: [promptInDatabase[0], responseInDataBase[0]],
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ msg: "an unknown error occured" });
          return;
        }
      }
      await main();
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "an unknown error occured" });
      return;
    }
  }
);
// the problem of the whole chat reanimating after a single message might be solved with atomFamily or selector family
