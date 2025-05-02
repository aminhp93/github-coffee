import React, { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

export const DEFAULT_OPTIONS = {
  editable: true,
  snap: (date: Date) => {
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    return Math.round(date.getTime() / oneDay) * oneDay;
  },
  showMajorLabels: true,
};

interface Props {
  items: any; // Array of timeline items
  options?: any; // Timeline options
  onItemClick?: (item: any) => void; // Callback for item click
  onItemMove?: (item: any) => void; // Callback for item move
}

const TimelineWrapper = ({
  items,
  options = DEFAULT_OPTIONS,
  onItemClick,
  onItemMove,
}: Props) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    // Initialize the timeline
    const timeline = new Timeline(timelineRef.current, items, options);

    // Handle item click
    if (onItemClick) {
      timeline.on("click", (props) => {
        onItemClick(props);
      });
    }

    // Handle item move
    if (onItemMove) {
      options.onMove = (item: any) => {
        onItemMove(item);
      };
    }

    return () => timeline.destroy();
  }, [options, onItemClick, onItemMove, items]);

  return <div ref={timelineRef} style={{ height: "300px" }} />;
};

export { TimelineWrapper };
