import { TimelineItem } from "vis-timeline/standalone";

export interface Item extends TimelineItem {
  extraData?: {
    description: string | null;
  };
}
