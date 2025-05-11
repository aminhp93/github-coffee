import React, { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import type { DataItemCollectionType, DataSet } from "vis-timeline/standalone";

export const DEFAULT_OPTIONS: {
  editable: boolean;
  snap: (date: Date) => number;
  showMajorLabels: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMove?: (item: any) => void;
} = {
  editable: true,
  snap: (date: Date) => {
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    return Math.round(date.getTime() / oneDay) * oneDay;
  },
  showMajorLabels: true,
};

interface Props<T extends { id: string | number }> {
  items: DataSet<T, "id">;
  options?: typeof DEFAULT_OPTIONS; // Timeline options
  onItemClick?: (data: {
    itemId: string | null; // ID of the clicked item
    group: string | null; // Group of the clicked item
    event: React.MouseEvent<HTMLElement>; // Mouse event
  }) => void; // Callback for item click
  onItemMove?: (item: T) => void; // Callback for item move
}

const TimelineWrapper = <T extends { id: string | number }>({
  items,
  options = DEFAULT_OPTIONS,
  onItemClick,
  onItemMove,
}: Props<T>) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    // Initialize the timeline
    const timeline = new Timeline(
      timelineRef.current,
      items as unknown as DataItemCollectionType,
      options
    );

    // Handle item click
    if (onItemClick) {
      timeline.on("click", (props) => {
        onItemClick(props);
      });
    }

    // Handle item move
    if (onItemMove) {
      options.onMove = (item: T) => {
        onItemMove(item);
      };
    }

    return () => timeline.destroy();
  }, [options, onItemClick, onItemMove, items]);

  return <div ref={timelineRef} style={{ height: "300px" }} />;
};

export { TimelineWrapper };
