import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Part2ABrokenList from './Part2ABrokenList';
import Part3AnExplosionPain from './Part3AnExplosionPain';
import Part4ManuallySyncFix from './Part4ManuallySyncFix';
import Part5SSOTGroupState from './Part5SSOTGroupState';
import Part6AntiUIDataPattern from './Part6AntiUIDataPattern';
import Part8RealWorldMUIDataGrid from './Part8RealWorldMUIDataGrid';

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function SSOT() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>Single Source of Truth</h2>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Part 2" {...a11yProps(0)} />
            <Tab label="Part 3" {...a11yProps(1)} />
            <Tab label="Part 4" {...a11yProps(2)} />
            <Tab label="Part 5" {...a11yProps(3)} />
            <Tab label="Part 6" {...a11yProps(4)} />
            <Tab label="Part 8" {...a11yProps(5)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Part2ABrokenList />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Part3AnExplosionPain />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Part4ManuallySyncFix />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Part5SSOTGroupState />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Part6AntiUIDataPattern />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <Part8RealWorldMUIDataGrid />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
export default SSOT;
