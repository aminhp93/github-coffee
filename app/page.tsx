"use client";

import axios from "axios";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import {
  DataGridPro,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid-pro";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const Home = () => {
  const [string, setString] = useState("");
  const [array, setArray] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await axios({
        method: "GET",
        url: "/api",
      });
      console.log(res);
      setString(res.data.stringResponse);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const res = await axios({
        method: "GET",
        url: "/api/array",
      });
      console.log(res);
      setArray(res.data.arrayResponse);
    };
    init();
  }, []);

  return (
    <Box>
      <Box>String: {string}</Box>
      <List>
        {array.map((item, index) => {
          return (
            <ListItem key={item}>
              <ListItemButton>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <DataGridProDemo />
    </Box>
  );
};

export default Home;

const DataGridProDemo = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};
