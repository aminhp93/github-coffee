/* eslint-disable @typescript-eslint/no-unused-vars */
// Import libraries
import { Box, Button } from "@mui/material";
import { styled } from "github-coffee-package/dist/theme";
import { useTranslation } from "github-coffee-package/dist/utils/translation";
import _ from "lodash";
import React, { useRef, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";

// Import local files
import useDashboardStore from "./store";
import {
  Widget,
  WidgetId,
  Dashboard as DashboardModel,
  WidgetType,
} from "./types";
import GridItem from "./GridItem";
import { getWidgetComponent } from "./utils";
import { DashboardLayout } from "./Layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const { t } = useTranslation();
  const editMode = useDashboardStore((state) => state.editMode);
  const setEditMode = useDashboardStore((state) => state.setEditMode);
  const [dashboard] = useState<DashboardModel>();
  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>({});
  const [breakpoint, setBreakpoint] = useState<{
    breakpoint: string;
    cols: number;
  }>();
  const [items, setItems] = useState<Widget[]>([
    {
      i: "1",
      type: "news",
      config: {},
      x: 0,
      y: 4,
      w: 6,
      h: 4,
    },
    {
      i: "2",
      type: "blog",
      config: {},
      x: 6,
      y: 4,
      w: 6,
      h: 4,
    },
  ]);
  const widgetsRef = useRef<Record<WidgetId, Widget>>({});

  // useEffect(() => {
  //   const fetchedDashboard = JSON.parse(
  //     localStorage.getItem("dashboard") ?? "null"
  //   ) as DashboardModel; //fetch dashboard
  //   if (fetchedDashboard) {
  //     const layouts = fetchedDashboard.content.layouts;
  //     const widgets = fetchedDashboard.content.widgets;
  //     setDashboard(fetchedDashboard);
  //     setLayouts(layouts);
  //     setItems(getItems(layouts, widgets));
  //     widgetsRef.current = _.keyBy(widgets, "i");
  //   }
  // }, []);

  const handleLayoutChange = (
    _: ReactGridLayout.Layout[],
    allLayout: ReactGridLayout.Layouts
  ) => {
    setLayouts(allLayout);
    // console.log(allLayout);
  };

  // We're using the cols coming back from this to calculate where to add new items.
  const onBreakpointChange = (breakpoint: string, cols: number) => {
    setBreakpoint({ breakpoint, cols });
  };

  const handleSaveDashboard = () => {
    const widgets = Object.values(widgetsRef.current).map(
      ({ i, type, config }) => ({ i, type, config })
    );
    const newDashboard = {
      ...dashboard,
      content: { layouts, widgets: widgets },
    };
    localStorage.setItem("dashboard", JSON.stringify(newDashboard));
  };

  const handleChangeConfig = (widget: Widget) => {
    widgetsRef.current[widget.i] = widget;
  };

  const createElement = (el: Widget) => {
    const widgetComponent = getWidgetComponent(el.type);
    const C = React.cloneElement(widgetComponent, {
      id: el.i,
      onChangeConfig: handleChangeConfig,
      config: el.config,
    });

    return (
      <div key={el.i} data-grid={el}>
        <div className="close-grid-item" onClick={() => onRemoveItem(el)}>
          Close
        </div>

        <GridItem>{C}</GridItem>
      </div>
    );
  };

  const onRemoveItem = (el: Widget) => {
    if (editMode) {
      setItems(_.reject(items, { i: el.i }));
      delete widgetsRef.current[el.i];
    }
  };

  const onAddWidget = (widgetType: WidgetType) => {
    if (editMode) {
      const newItem = {
        i: uuidv4(),
        x: (items.length * 2) % (breakpoint?.cols || 12),
        y: 4, // puts it at the bottom
        w: 4,
        h: 8,
        type: widgetType,
        config: {},
      };
      const newItems = items.concat(newItem);
      setItems(newItems);
      widgetsRef.current[newItem.i] = newItem;
    }
  };

  return (
    <DashboardLayout>
      <DashboardBox
        sx={{
          ".react-grid-item:hover .close-grid-item": {
            display: editMode ? "block" : "none",
          },
        }}
      >
        {/* <Button onClick={() => setEditMode(!editMode)}>
          {editMode ? t("edit") : t("view")}
        </Button>
        <Button onClick={() => onAddWidget("blog")}>{t("add blog")}</Button>
        <Button onClick={() => onAddWidget("stock")}>{t("add stock")}</Button>
        <Button onClick={handleSaveDashboard}>{t("saveDashboard")}</Button> */}
        <ResponsiveReactGridLayout
          // className="layout"
          layouts={layouts}
          isResizable={false}
          onLayoutChange={handleLayoutChange}
          isDraggable={false}
          // draggableHandle=".drag-handle"
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          // resizeHandles={["se", "ne", "nw", "sw"]}
          onBreakpointChange={onBreakpointChange}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          // margin={[0, 0]} // No margin between widgets
          // containerPadding={[0, 0]}
          // rowHeight={100}
        >
          {_.map(items, (el) => createElement(el))}
        </ResponsiveReactGridLayout>
      </DashboardBox>
    </DashboardLayout>
  );
};

export default Dashboard;

const DashboardBox = styled(Box)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    width: "100%",
    ".close-grid-item": {
      display: "none",
    },
    ".react-grid-item:hover .close-grid-item": {
      display: "block",
      position: "absolute",
      right: "-21px",
      top: "-12px",
      fontSize: theme.spacing(6),
      marginRight: "10px",
      background: theme.palette.grey[900],
      borderRadius: theme.shape.borderRadius,
      cursor: "pointer",
      border: `1px solid ${theme.palette.grey[900]}`,
      zIndex: 9999,
    },
  };
});
