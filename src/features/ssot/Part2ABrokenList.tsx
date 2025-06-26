import { useEffect, useState } from 'react';
import { type Item } from './utils';
import { DATA } from './utils';

export default function ManualSyncHellPart2() {
  const [data, setData] = useState<Item[]>(DATA);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>(data);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]); // ❌ manually managed

  // 🔥 Manual sync on filter
  useEffect(() => {
    setFilteredItems(
      filterRole ? data.filter((item) => item.role === filterRole) : data
    );
  }, [data, filterRole]);

  const toggleSelect = (item: Item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const removeAlice = () => {
    setData((prev) => prev.filter((item) => item.name !== 'Alice'));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>❌ Manual State Sync: Filter + Selection</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Filter:</strong>{' '}
        <button onClick={() => setFilterRole(null)}>All</button>
        <button onClick={() => setFilterRole('Dev')}>Dev</button>
        <button onClick={() => setFilterRole('QA')}>QA</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={removeAlice}>🗑️ Remove Alice</button>
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
        <p>
          🗃 <strong>Raw Data:</strong> {data.map((i) => i.name).join(', ')}
        </p>
      </div>
    </div>
  );
}
