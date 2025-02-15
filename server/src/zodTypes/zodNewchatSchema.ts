import z from "zod";

export const newchatSchema = z.object({ prompt: z.string().min(1) });
