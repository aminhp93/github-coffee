import { DATA } from './utils';
import { useState } from 'react';
import SimpleVersion from './SimpleVersion';

import ManualSyncHellFull from './ManualSyncHellFull';
import SSOTListSingleState from './SSOTListSingleState';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function SSOT() {
  const [listData, setListData] = useState(DATA);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <h1>Single Source of Truth</h1>
      <div style={{ paddingLeft: 20, position: "fixed", bottom: 0 }}>
        <strong>Data Action:</strong>{' '}
        <button
          onClick={() => {
            setListData(listData.filter((i) => i.id !== 1));
          }}
        >
          delete row 1
        </button>
        <button
          onClick={() => {
            setListData(listData.filter((i) => i.id !== 2));
          }}
        >
          delete row 2
        </button>
        <button
          onClick={() => {
            setListData(listData.filter((i) => i.id !== 3));
          }}
        >
          delete row 3
        </button>
        <button
          onClick={() => {
            setListData(listData.filter((i) => i.id !== 4));
          }}
        >
          delete row 4
        </button>
        <button
          onClick={() => {
            setListData(listData.filter((i) => i.id !== 5));
          }}
        >
          delete row 5
        </button>
        <button
          onClick={() => {
            setListData(DATA);
          }}
        >
          reset
        </button>
      </div>
      

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Simple Version" {...a11yProps(0)} />
          <Tab label="Complex Version" {...a11yProps(1)} />
          <Tab label="Working Version" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <SimpleVersion listData={listData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      <ManualSyncHellFull listData={listData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
      <SSOTListSingleState listData={listData} />
      </CustomTabPanel>
    </Box>
  );
}
export default SSOT;
