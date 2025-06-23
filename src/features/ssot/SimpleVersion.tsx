import { useEffect, useState } from 'react';
import { type Item } from './utils';

interface Props {
  listData: Item[];
}
export default function ManualSyncHellFull(props: Props) {

  const [filterRole, setFilterRole] = useState<string | null>(null);

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>(props.listData); // 🔥 manually synced!



  // 🔥 Filter logic must be duplicated manually
  useEffect(() => {
    setFilteredItems(() =>
      filterRole ? props.listData.filter((d) => d.role === filterRole) : props.listData
    );
  }, [props.listData, filterRole]);

  const toggleSelect = (item: Item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Filter:</strong>{' '}
        <button onClick={() => setFilterRole(null)}>All</button>
        <button onClick={() => setFilterRole('Dev')}>Dev</button>
        <button onClick={() => setFilterRole('QA')}>QA</button>
      </div>

 

      <ul>
        {filteredItems.map((item) => (
          <li
            key={item.id}
            onClick={() => toggleSelect(item)}
            style={{
              cursor: 'pointer',
              padding: 8,
              margin: 4,
              border: '1px solid #ccc',
              backgroundColor: selectedItems.some((s) => s.id === item.id)
                ? '#bbdefb'
                
                  : '#fff',
            }}
          >
            {item.name} - {item.role}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <p>
          🧠 <strong>Selected Items:</strong>{' '}
          {selectedItems.length
            ? selectedItems.map((i) => i.name).join(', ')
            : 'None'}
        </p>
       
        <p>
          🔎 <strong>Filtered Items:</strong>{' '}
          {filteredItems.map((i) => i.name).join(', ') || 'Empty'}
        </p>
      </div>
    </div>
  );
}
