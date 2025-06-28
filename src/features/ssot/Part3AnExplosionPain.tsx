import { useState } from 'react';
import { type Item } from './utils';
import { DATA } from './utils';

export default function ManualSyncHellPart3() {
  const [data, setData] = useState<Item[]>(DATA);
  const [, setFilterRole] = useState<string | null>(null);
  const [filteredItems] = useState<Item[]>(data);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]); // ❌ manually managed
  const [highlightItem, setHighlightItem] = useState<Item | null>(null); // ❌ manually managed

  // 🔥 Filter logic must be synced manually
  // useEffect(() => {
  //   setFilteredItems(
  //     filterRole ? data.filter((item) => item.role === filterRole) : data
  //   );
  // }, [data, filterRole]);

  // 🔥 Selected items must be revalidated manually
  // useEffect(() => {
  //   setSelectedItems(
  //     (prev) =>
  //       prev
  //         .map((sel) => data.find((d) => d.id === sel.id))
  //         .filter(Boolean) as Item[]
  //   );
  // }, [data]);

  // 🔥 Highlight must also be checked manually
  // useEffect(() => {
  //   setHighlightItem((prev) =>
  //     prev && data.some((d) => d.id === prev.id) ? prev : null
  //   );
  // }, [data]);

  const toggleSelect = (item: Item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const highlight = (item: Item) => {
    setHighlightItem(item);
  };

  const removeAlice = () => {
    setData((prev) => prev.filter((item) => item.name !== 'Alice'));
  };

  const addEve = () => {
    const nextId = Math.max(...data.map((d) => d.id)) + 1;
    setData((prev) => [...prev, { id: nextId, name: 'Eve', role: 'QA' }]);
  };

  const highlightAlice = () => {
    const alice = data.find((item) => item.name === 'Alice');
    if (alice) setHighlightItem(alice);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💥 Manual Sync Explosion: Filter + Select + Highlight + Dynamic</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Filter:</strong>{' '}
        <button onClick={() => setFilterRole(null)}>All</button>
        <button onClick={() => setFilterRole('Dev')}>Dev</button>
        <button onClick={() => setFilterRole('QA')}>QA</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={highlightAlice}>🌟 Highlight Alice</button>
        <button onClick={addEve}>➕ Add Eve</button>
        <button onClick={removeAlice}>🗑️ Remove Alice</button>
      </div>

      <ul>
        {filteredItems.map((item) => (
          <li
            key={item.id}
            onClick={() => toggleSelect(item)}
            onDoubleClick={() => highlight(item)}
            style={{
              cursor: 'pointer',
              padding: 8,
              margin: 4,
              border: '1px solid #ccc',
              backgroundColor: selectedItems.some((s) => s.id === item.id)
                ? '#bbdefb'
                : highlightItem?.id === item.id
                  ? '#fff59d'
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
          🌟 <strong>Highlight Item:</strong> {highlightItem?.name ?? 'None'}
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
