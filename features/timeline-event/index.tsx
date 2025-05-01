import { DataSet, Timeline, TimelineItem } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import React, { useEffect, useRef } from "react";
import { keyBy } from "lodash";
import dayjs from "dayjs";
import { MOCK_DATA } from "./constants";

const TimelineEvent = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = React.useState(new DataSet(MOCK_DATA.events));

  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const options = {
      //   stack: false,
      //   start: "2025-04-01",
      //   end: "2025-07-01",
      editable: true,
      snap: (date: Date) => {
        // Snap to the nearest day
        const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        return Math.round(date.getTime() / oneDay) * oneDay;
      },
      showMajorLabels: false,
      //   onAdd: function (item, callback) {
      //     prettyPrompt(
      //       "Add item",
      //       "Enter text content for new item:",
      //       item.content,
      //       function (value) {
      //         if (value) {
      //           item.content = value;
      //           callback(item); // send back adjusted new item
      //         } else {
      //           callback(null); // cancel item creation
      //         }
      //       }
      //     );
      //   },

      onMove: function (item: TimelineItem) {
        console.log("onMove", item);

        const updatedItem = {
          ...item,
          id: String(item.id),
          content: String(item.content),
          start: dayjs(item.start).format("YYYY-MM-DD"),
        };
        // update list items
        setItems((prevItems) => {
          const updatedItems = new DataSet(prevItems.get());
          updatedItems.update(updatedItem);
          return updatedItems;
        });

        // var title =
        //   "Do you really want to move the item to\n" +
        //   "start: " +
        //   item.start +
        //   "\n" +
        //   "end: " +
        //   item.end +
        //   "?";

        // prettyConfirm("Move item", title, function (ok) {
        //   if (ok) {
        //     callback(item); // send back item as confirmation (can be changed)
        //   } else {
        //     callback(null); // cancel editing item
        //   }
        // });
      },

      //   onMoving: function (item, callback) {
      //     if (item.start < min) item.start = min;
      //     if (item.start > max) item.start = max;
      //     if (item.end > max) item.end = max;

      //     callback(item); // send back the (possibly) changed item
      //   },

      //   onUpdate: function (item, callback) {
      //     prettyPrompt(
      //       "Update item",
      //       "Edit items text:",
      //       item.content,
      //       function (value) {
      //         if (value) {
      //           item.content = value;
      //           callback(item); // send back adjusted item
      //         } else {
      //           callback(null); // cancel updating the item
      //         }
      //       }
      //     );
      //   },

      //   onRemove: function (item, callback) {
      //     prettyConfirm(
      //       "Remove item",
      //       "Do you really want to remove item " + item.content + "?",
      //       function (ok) {
      //         if (ok) {
      //           callback(item); // confirm deletion
      //         } else {
      //           callback(null); // cancel deletion
      //         }
      //       }
      //     );
      //   },
    };

    const timeline = new Timeline(timelineRef.current, items, options);

    // Handle dragend event to get updated item
    timeline.on("dragend", (props) => {
      if (props.item) {
        const updatedItem = items.get(props.item); // Get the updated item
        console.log("Updated item after drag:", updatedItem);
      }
    });

    // Add click event listener
    timeline.on("click", (props) => {
      if (props.item) {
        console.log("Clicked item ID:", props.item);
        setSelectedId(props.item);
      } else {
        console.log("Clicked on empty space");
      }
    });

    return () => timeline.destroy();
  }, [items]);

  const selectedItem = selectedId ? keyBy(items.get(), "id")[selectedId] : null;
  console.log("items", items.get(), selectedItem);

  return (
    <div>
      <div ref={timelineRef} style={{ height: "300px" }} />
      <div style={{ marginTop: "20px" }}>
        {selectedId !== null ? (
          <>
            <p>Selected item ID: {selectedId}</p>
            <p>Content: {selectedItem?.content}</p>
            <p>Start: {selectedItem?.start}</p>
          </>
        ) : (
          <p>No item selected</p>
        )}
      </div>
    </div>
  );
};
export default TimelineEvent;
