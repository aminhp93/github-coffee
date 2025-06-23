import { useMemo, useState, useEffect } from 'react';
import { type Item } from './utils';

interface Props {
  listData: Item[];
}

export default function SSOTListSingleState(props: Props) {
  // 🔵 Data State
  const [data, setData] = useState<Item[]>(props.listData);

  // 🟠 Grouped UI State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState<string | null>(null);

  useEffect(() => {
    setData(props.listData);
  }, [props.listData]);

  // ✅ Derived state from SSOT (data)
  const filteredItems = useMemo(() => {
    return filterRole ? data.filter((d) => d.role === filterRole) : data;
  }, [data, filterRole]);

  const selectedItems = useMemo(() => {
    return data.filter((d) => selectedIds.includes(d.id));
  }, [data, selectedIds]);

  const highlightItem = useMemo(() => {
    return data.find((d) => d.id === highlightId) ?? null;
  }, [data, highlightId]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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
        <button onClick={() => setHighlightId(3)}>
          Highlight Charlie (id=3)
        </button>{' '}
        <button onClick={() => setHighlightId(null)}>Clear Highlight</button>
      </div>

      <ul>
        {filteredItems.map((item) => (
          <li
            key={item.id}
            onClick={() => toggleSelect(item.id)}
            style={{
              cursor: 'pointer',
              padding: 8,
              margin: 4,
              border: '1px solid #ccc',
              backgroundColor: selectedIds.includes(item.id)
                ? '#bbdefb'
                : highlightId === item.id
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
