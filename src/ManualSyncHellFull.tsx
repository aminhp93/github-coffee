import { useEffect, useState } from 'react';
import { type Item } from './utils';

interface Props {
  listData: Item[];
}
export default function ManualSyncHellFull(props: Props) {
  const [data, setData] = useState<Item[]>(props.listData);

  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [highlightItem, setHighlightItem] = useState<Item | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>(data); // 🔥 manually synced!

  useEffect(() => {
    setData(props.listData);
  }, [props.listData]);

  // 🔥 Sync all dependent states MANUALLY when data changes
  useEffect(() => {
    // Remap selected items
    setSelectedItems(
      (prev) =>
        prev
          .map((sel) => data.find((d) => d.id === sel.id))
          .filter(Boolean) as Item[]
    );

    // Remap highlight item
    setHighlightItem((prev) =>
      prev ? (data.find((d) => d.id === prev.id) ?? null) : null
    );

    // Remap filtered items
    setFilteredItems(() => {
      return filterRole ? data.filter((d) => d.role === filterRole) : data;
    });
  }, [data, filterRole]);

  // 🔥 Filter logic must be duplicated manually
  useEffect(() => {
    setFilteredItems(() =>
      filterRole ? data.filter((d) => d.role === filterRole) : data
    );
  }, [data, filterRole]);

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

      <div style={{ marginBottom: 10 }}>
        <strong>Highlight:</strong>{' '}
        <button
          onClick={() => setHighlightItem(data.find((i) => i.id === 3) ?? null)}
        >
          Highlight Charlie (id=3)
        </button>{' '}
        <button onClick={() => setHighlightItem(null)}>Clear Highlight</button>
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
      </div>
    </div>
  );
}
