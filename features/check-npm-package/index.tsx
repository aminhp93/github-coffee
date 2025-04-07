import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useMemo, useState, useCallback } from "react";
import axios from "axios";

import { useLocalStorageState } from "@/@core/hooks/useLocalStorageState";
import { LIST_PACKAGE_KEY } from "./utils";

const CheckNpmPackage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [newPackage, setNewPackage] = useState<string>("");
  // Use the custom hook here
  const [listPackage, setListPackage] = useLocalStorageState<string[]>(
    LIST_PACKAGE_KEY,
    []
  );

  const [selectedPackage, setSelectedPackage] = useState<string | null>(
    listPackage[0] ?? null
  );

  const handleTest = useCallback(async () => {
    try {
      // const url = "https://www.npmjs.com/package/react";
      const url = `https://registry.npmjs.org/${selectedPackage}`;
      const res = await axios.get(url);
      console.log(res);

      setData(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error.response.data.error === "Not found") {
        // remove this package from listPackage
        setListPackage((prev) => {
          return prev.filter((i) => i !== selectedPackage);
        });
      }
    }
  }, [selectedPackage, setListPackage]);

  const time = useMemo(() => {
    if (!data) return [];
    // filter only key version format sematic versioning like 12.0.3. All other rc, experimental, etc. will be excluded
    const time = data.time;
    const keys = Object.keys(time).filter((key) => {
      return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(key);
    });

    // get last 2 latest keys
    const filteredList = keys.map((i) => {
      return {
        key: i,
        value: time[i],
      };
    });

    // order filteredList by value
    filteredList.sort((a, b) => {
      return new Date(b.value).getTime() - new Date(a.value).getTime();
    });

    console.log("keys", filteredList);
    // get last 2
    return filteredList.slice(0, 2).map((i) => {
      return {
        key: i.key,
        value: i.value,
      };
    });
  }, [data]);

  console.log(time);

  const handleAdd = () => {
    setListPackage((prev) => {
      // make list unique
      if (!newPackage?.trim() || prev.includes(newPackage.trim())) return prev;
      return [...prev, newPackage.trim()];
    });
    setNewPackage("");
  };

  return (
    <Box>
      <h1 className="text-3xl font-bold underline">Check npm package</h1>
      <TextField
        value={newPackage}
        label="Enter package name"
        onChange={(e) => {
          console.log(e.target.value);
          setNewPackage(e.target.value);
        }}
      />
      <Button onClick={handleAdd}>Add</Button>
      <Box className="flex">
        <Autocomplete
          value={selectedPackage}
          disablePortal
          options={listPackage}
          sx={{ width: 300 }}
          onChange={(_, newValue: string | null) => {
            setSelectedPackage(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Package" />}
        />
        <Button onClick={handleTest}>Test</Button>
      </Box>
      {time.map((i) => {
        return (
          <div key={i.key}>
            {i.key} - {i.value}
          </div>
        );
      })}
    </Box>
  );
};

export default CheckNpmPackage;
