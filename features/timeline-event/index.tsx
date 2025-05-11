import { DataSet } from "vis-timeline/standalone";
import { useEffect, useState } from "react";
import { keyBy } from "lodash";
import { MOCK_DATA } from "./constants";
import { TimelineWrapper } from "@/@core/components/timeline";
import { ListItemWrapper } from "./ListItemWrapper";
import { EventService } from "@/@core/services/http/event";
import { EventSchema } from "@/@core/services/http/event/schema";
import { Markdown } from "@/@core/utils/markdown";
import { dayjs } from "@/@core/utils/datetime";
import { Item } from "./types";

const TimelineEvent = () => {
  const [items, setItems] = useState<DataSet<Item>>(() => new DataSet<Item>());
  new DataSet(MOCK_DATA.events);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the server when the component mounts
    const fetchData = async () => {
      try {
        const response = await EventService.list();
        const parsedData = EventSchema.parse(response.data);

        // map data
        const mappedData = parsedData.data.map((item) => ({
          id: item.id,
          content: item.name,
          start: dayjs(item.datetime).format("YYYY-MM-DD"),
          extraData: {
            description: item.description,
          },
          type: "point",
        }));

        setItems(new DataSet(mappedData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (props: {
    itemId: string | null;
    group: string | null;
    event: React.MouseEvent<HTMLElement>;
  }) => {
    if (props.itemId) {
      setSelectedId(props.itemId);
    } else {
      console.log("Clicked on empty space");
    }
  };

  const handleItemMove = (item: Item) => {
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
            <p>Title: {selectedItem?.content}</p>
            <p>Date: {selectedItem?.start}</p>
            <p>
              Description:
              <Markdown>{selectedItem?.extraData?.description}</Markdown>
            </p>
          </>
        ) : (
          <p>No item selected</p>
        )}
      </div>
      <TimelineWrapper
        items={items as DataSet<Item>}
        onItemClick={handleItemClick}
        onItemMove={handleItemMove}
      />
    </div>
  );
};
export default TimelineEvent;
