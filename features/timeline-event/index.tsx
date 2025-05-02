import { DataSet } from "vis-timeline/standalone";
import React, { useEffect } from "react";
import { keyBy } from "lodash";
import dayjs from "dayjs";
import { MOCK_DATA } from "./constants";
import { TimelineWrapper } from "@/@core/components/timeline";
import { ListItemWrapper } from "./ListItemWrapper";
import { EventService } from "@/@core/services/http/event";
import { EventSchema } from "@/@core/services/http/event/schema";

const TimelineEvent = () => {
  const [items, setItems] = React.useState(new DataSet(MOCK_DATA.events));
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the server when the component mounts
    const fetchData = async () => {
      try {
        const response = await EventService.list();
        console.log("Fetched data:", response.data);
        const parsedData = EventSchema.parse(response.data);

        // map data

        const mappedData = parsedData.data.map((item) => ({
          id: item.id,
          content: item.name,
          start: dayjs(item.datetime).format("YYYY-MM-DD"),
          type: "point",
        }));

        setItems(new DataSet(mappedData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (props: any) => {
    if (props.item) {
      console.log("Clicked item ID:", props.item);
      setSelectedId(props.item);
    } else {
      console.log("Clicked on empty space");
    }
  };

  const handleItemMove = (item: any) => {
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
  };

  const selectedItem = selectedId ? keyBy(items.get(), "id")[selectedId] : null;
  console.log("items", items.get(), selectedItem);

  return (
    <div>
      <ListItemWrapper listItems={items.get()} />
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
      <TimelineWrapper
        items={items}
        onItemClick={handleItemClick}
        onItemMove={handleItemMove}
      />
    </div>
  );
};
export default TimelineEvent;
