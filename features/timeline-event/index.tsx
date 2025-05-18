import { DataSet } from "vis-timeline/standalone";
import { useCallback, useEffect, useState } from "react";
import { keyBy } from "lodash";
import { TimelineWrapper } from "@/@core/components/timeline";
import { ListItemWrapper } from "./ListItemWrapper";
import { EventService } from "@/@core/services/http/event";
import { EventSchema } from "@/@core/services/http/event/schema";
import { Markdown } from "@/@core/utils/markdown";
import { dayjs } from "@/@core/utils/datetime";
import { Item } from "./types";
import { useSnackbar } from "@/@core/components/notification";

const TimelineEvent = () => {
  const [items, setItems] = useState<DataSet<Item>>(() => new DataSet<Item>());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Fetch data from the server when the component mounts
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await EventService.list();
        const parsedData = EventSchema.parse(response.data);

        // map data
        const mappedData = parsedData.data.map((item) => {
          const end = item.end_datetime
            ? dayjs(item.end_datetime).format("YYYY-MM-DD")
            : null;

          if (end) {
            return {
              id: item.id,
              content: item.name,
              start: dayjs(item.start_datetime).format("YYYY-MM-DD"),
              end: end,
              extraData: {
                description: item.description,
              },
            };
          }
          return {
            id: item.id,
            content: item.name,
            start: dayjs(item.start_datetime).format("YYYY-MM-DD"),

            extraData: {
              description: item.description,
            },
            type: "point",
          };
        });

        setItems(new DataSet(mappedData) as DataSet<Item>);
        setLoading(false);
        enqueueSnackbar({
          message: "Data fetched successfully",
          variant: "success",
        });
      } catch (error) {
        setLoading(false);
        enqueueSnackbar({
          message: "Error fetching data",
          variant: "error",
        });
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  const handleItemClick = useCallback(
    (props: {
      item: string | null;
      group: string | null;
      event: React.MouseEvent<HTMLElement>;
    }) => {
      if (props.item) {
        setSelectedId(props.item);
      } else {
        console.log("Clicked on empty space");
      }
    },
    []
  );

  const handleItemMove = useCallback((item: Item) => {
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
  }, []);

  const selectedItem = selectedId ? keyBy(items.get(), "id")[selectedId] : null;
  console.log("items", items.get(), selectedItem);

  return (
    <div>
      <ListItemWrapper listItems={items.get()} />
      <div style={{ marginTop: "20px" }}>
        {selectedId !== null ? (
          <>
            <p>Selected item ID: {selectedId}</p>
            <p>Title: {selectedItem?.content as string}</p>
            <p>Date: {selectedItem?.start as string}</p>
            <p>
              Description:
              <Markdown>{selectedItem?.extraData?.description}</Markdown>
            </p>
          </>
        ) : (
          <p>No item selected</p>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TimelineWrapper
          items={items as DataSet<Item>}
          onItemClick={handleItemClick}
          onItemMove={handleItemMove}
        />
      )}
    </div>
  );
};
export default TimelineEvent;
