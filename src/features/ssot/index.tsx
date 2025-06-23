import Box from '@mui/material/Box';
import { DATA } from './utils';
import { useState } from 'react';
import List from './ManualSyncHellFull';
// import List from './SSOTListSingleState';
// import List from './SSOTListGroupedState';
// import Table from './CleanGrid';

function SSOT() {
  const [listData, setListData] = useState(DATA);

  return (
    <Box>
      <h1>Single Source of Truth</h1>
      <div style={{ paddingLeft: 20 }}>
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
      <List listData={listData} />
      {/* <Table listData={listData} /> */}
    </Box>
  );
}
export default SSOT;
