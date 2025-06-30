import { useMemo, useState } from 'react';
import { type Item } from './utils';
import { DATA } from './utils';

export default function SSOTSingleState() {
  // ✅ 1. Data is the single source of truth
  const [data, setData] = useState<Item[]>(DATA);

  // ✅ 2. Minimal UI state — no derived data stored
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  // ✅ 3. Derived view — filteredItems
  const filteredItems = useMemo(() => {
    return filterRole ? data.filter((item) => item.role === filterRole) : data;
  }, [data, filterRole]);

  // ✅ 4. Derived: selected items that still exist
  const selectedItems = useMemo(() => {
    return data.filter((item) => selectedIds.includes(item.id));
  }, [data, selectedIds]);

  // ✅ 5. Derived view — highlighted item if it still exists
  const highlightItem = useMemo(() => {
    return data.find((item) => item.id === highlightId) || null;
  }, [data, highlightId]);

  // UI Handlers
  const toggleSelect = (item: Item) => {
    setSelectedIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const removeAlice = () => {
    setData((prev) => prev.filter((item) => item.name !== 'Alice'));
  };

  const addEve = () => {
    const nextId = Math.max(0, ...data.map((d) => d.id)) + 1;
    setData((prev) => [...prev, { id: nextId, name: 'Eve', role: 'QA' }]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>✅ SSOT — Minimal State, Derived Views</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Filter:</strong>{' '}
        <button onClick={() => setFilterRole(null)}>All</button>
        <button onClick={() => setFilterRole('Dev')}>Dev</button>
        <button onClick={() => setFilterRole('QA')}>QA</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={removeAlice}>🗑️ Remove Alice</button>
        <button onClick={addEve}>➕ Add Eve</button>
        <button onClick={() => setHighlightId(3)}>
          ⭐ Highlight Charlie (ID 3)
        </button>
        <button onClick={() => setHighlightId(null)}>❌ Clear Highlight</button>
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
              backgroundColor: selectedIds.includes(item.id)
                ? '#bbdefb'
                : item.id === highlightId
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
