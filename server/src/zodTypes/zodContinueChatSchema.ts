import z from "zod";

export const zodContinueChatSchema = z.object({ chatId: z.string().min(1) });
