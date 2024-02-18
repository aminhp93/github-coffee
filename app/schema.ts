import { z } from "zod";

const RequestSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export type RequestType = z.infer<typeof RequestSchema>;
