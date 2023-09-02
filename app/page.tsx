"use client";

import { Provider, useDispatch, connect } from "react-redux";
import store from "./store";
import { useState, useEffect } from "react";
import {
  defaultEventFilter,
  selectEventFilter,
  selectFilteredEvents,
} from "./store/events";
import { fetchEvents, updateEventFilter } from "./store/actions/events";
import { DataGridPro } from "@mui/x-data-grid-pro";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function HomeContainer() {
  return (
    <Provider store={store}>
      <ConnectHome />
    </Provider>
  );
}

const Home = (props: any) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(defaultEventFilter);

  const handleClick = () => {
    dispatch(fetchEvents());
  };

  const headers = [
    {
      field: "time",
      headerName: "date_and_time",
      width: 180,
      filterable: false,
    },
    {
      field: "user",
      headerName: "user",
      width: 120,
    },
    {
      field: "module",
      headerName: "module",
      width: 150,
      sortable: false,
    },
    {
      field: "type",
      headerName: "type",
      width: 120,
      sortable: false,
    },
    {
      field: "object",
      headerName: "object",
      width: 150,
      sortable: false,
    },
    {
      field: "objectId",
      headerName: "object" + "Id",
      width: 150,
      sortable: false,
    },
    {
      field: "method",
      headerName: "method",
      width: 150,
      sortable: false,
    },
    {
      field: "property",
      headerName: "property",
      width: 150,
      sortable: false,
    },
    {
      field: "prevValue",
      headerName: "previous_value",
      width: 200,
      sortable: false,
    },
    {
      field: "value",
      headerName: "value",
      width: 200,
      sortable: false,
    },
    {
      field: "subsystem",
      headerName: "subsystem",
      width: 150,
      sortable: false,
    },
    {
      field: "optText",
      headerName: "opt" + "text",
      width: 150,
      sortable: false,
    },
  ];

  const getTwoDigit = (initialNumber: any) => {
    return ("0" + initialNumber).slice(-2);
  };

  const getTimeString = (epoch: any) => {
    try {
      const timeObj = new Date(Number(epoch));

      const date = [
        timeObj.getFullYear(),
        getTwoDigit(timeObj.getMonth() + 1),
        getTwoDigit(timeObj.getDate()),
      ];
      const time = [
        getTwoDigit(timeObj.getHours()),
        getTwoDigit(timeObj.getMinutes()),
        getTwoDigit(timeObj.getSeconds()),
      ];

      const result = `${date.join("-")} ${time.join(":")}`;
      return result;
    } catch (e) {
      console.error(e);
      return "Invalid time";
    }
  };

  const arrangeData = (events: any) => {
    const data =
      events?.map((items: any, index: any) => ({
        ...items,
        id: index,
        time: getTimeString(items.time),
      })) || [];
    return data;
  };

  const handleChange = (event: any) => {
    const checked = event.target.checked;
    setFilter((old) => {
      let newFilter: any = { ...old };
      if (checked) {
        newFilter = {
          ...newFilter,
          ignore: {},
        };
      } else {
        newFilter = {
          ...newFilter,
          ignore: {
            columns: ["user"],
            isEmpty: true,
            isNull: true,
          },
        };
      }
      return newFilter;
    });
  };

  useEffect(() => {
    dispatch(updateEventFilter(filter));
  }, [filter, dispatch]);

  return (
    <div onClick={handleClick}>
      <div className="">
        <FormGroup>
          <FormControlLabel
            control={<Switch onClick={handleChange} />}
            label="Show all"
          />
        </FormGroup>
        <DataGridPro
          density="compact"
          columns={headers}
          // sortingOrder={sortingOrder}
          rows={arrangeData(props.filteredEvents)}
          // localeText={dataGridProLocalization}
          // onRowsScrollEnd={onAddRowLimit.bind(this)}
          // onSortModelChange={onSortModelChange.bind(this)}
          // columnVisibilityModel={columnVisibilityModel}
          // onColumnVisibilityModelChange={(newModel) =>
          //   setColumnVisibilityModel(newModel)
          // }
          // onCellClick={handleClick}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  eventFilter: selectEventFilter(state),
  filteredEvents: selectFilteredEvents(state),
});

const ConnectHome = connect(mapStateToProps)(Home);
