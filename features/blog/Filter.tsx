import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const LIST_CATEGORY = ["Core", "Docs", "No longer use"];
export const DEFAULT_LIST_CATEGORY = [LIST_CATEGORY[0]];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

type Props = {
  listCategory: string[];
  setListCategory: (value: string[]) => void;
};

export default function Filter(props: Props) {
  const { listCategory, setListCategory } = props;
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof listCategory>) => {
    const {
      target: { value },
    } = event;
    setListCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Filter</InputLabel>
        <Select
          size="small"
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={listCategory}
          onChange={handleChange}
          input={<OutlinedInput label="Filter" />}
          MenuProps={MenuProps}
        >
          {LIST_CATEGORY.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, listCategory, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
