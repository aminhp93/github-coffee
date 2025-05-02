import { z } from "zod";

export const EventItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  datetime: z.string().optional(),
  descriptin: z.string().optional(),
});

export const EventSchema = z.object({
  name: z.string(),
  data: z.array(EventItemSchema),
});

export type EventItem = z.infer<typeof EventItemSchema>;
export type Event = z.infer<typeof EventSchema>;
