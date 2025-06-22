import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DATA } from './utils';
import { useState } from 'react';
// import List from './ManualSyncHellFull';
// import List from './SSOTListSingleState';
import List from './SSOTListGroupedState';
import Table from './CleanGrid';

function App() {
  const [listData, setListData] = useState(DATA);

  return (
    <Box>
      <h1>Single Source of Truth</h1>

      <Button
        onClick={() => {
          setListData(listData.filter((i) => i.id !== 1));
        }}
      >
        delete row 1
      </Button>
      <Button
        onClick={() => {
          setListData(listData.filter((i) => i.id !== 2));
        }}
      >
        delete row 2
      </Button>
      <Button
        onClick={() => {
          setListData(listData.filter((i) => i.id !== 3));
        }}
      >
        delete row 3
      </Button>
      <Button
        onClick={() => {
          setListData(listData.filter((i) => i.id !== 4));
        }}
      >
        delete row 4
      </Button>
      <Button
        onClick={() => {
          setListData(listData.filter((i) => i.id !== 5));
        }}
      >
        delete row 5
      </Button>
      <Button
        onClick={() => {
          setListData(DATA);
        }}
      >
        reset
      </Button>

      <List listData={listData} />
      <Table listData={listData} />
    </Box>
  );
}
export default App;
