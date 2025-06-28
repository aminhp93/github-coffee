import { useMemo, useState } from 'react';
import { type Item } from './utils';
import { DATA } from './utils';

export default function SSOTSolution() {
  // ✅ 1. Data is the single source of truth
  const [data, setData] = useState<Item[]>(DATA);

  // ✅ 2. Minimal UI state — no derived data stored
  const [uiState, setUiState] = useState<{
    filterRole: string | null;
    selectedIds: number[];
    highlightId: number | null;
  }>({
    filterRole: null,
    selectedIds: [],
    highlightId: null,
  });

  // ✅ 3. Derived view — filteredItems
  const filteredItems = useMemo(() => {
    return uiState.filterRole
      ? data.filter((item) => item.role === uiState.filterRole)
      : data;
  }, [data, uiState.filterRole]);

  // ✅ 4. Derived view — selected items that still exist
  const selectedItems = useMemo(() => {
    return data.filter((item) => uiState.selectedIds.includes(item.id));
  }, [data, uiState.selectedIds]);

  // ✅ 5. Derived view — highlighted item if it still exists
  const highlightItem = useMemo(() => {
    return data.find((item) => item.id === uiState.highlightId) || null;
  }, [data, uiState.highlightId]);

  // 🔄 UI Handlers
  const toggleSelect = (item: Item) => {
    setUiState((prev) => {
      const selected = prev.selectedIds.includes(item.id)
        ? prev.selectedIds.filter((id) => id !== item.id)
        : [...prev.selectedIds, item.id];

      return { ...prev, selectedIds: selected };
    });
  };

  const setFilter = (role: string | null) => {
    setUiState((prev) => ({ ...prev, filterRole: role }));
  };

  const setHighlight = (item: Item | null) => {
    setUiState((prev) => ({ ...prev, highlightId: item?.id ?? null }));
  };

  const removeAlice = () => {
    setData((prev) => prev.filter((item) => item.name !== 'Alice'));
  };

  const addEve = () => {
    const nextId = Math.max(0, ...data.map((d) => d.id)) + 1;
    setData((prev) => [...prev, { id: nextId, name: 'Eve', role: 'QA' }]);
  };

  const highlightAlice = () => {
    const alice = data.find((item) => item.name === 'Alice');
    if (alice) setHighlight(alice);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>✅ SSOT — Derived, Not Duplicated</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Filter:</strong>{' '}
        <button onClick={() => setFilter(null)}>All</button>
        <button onClick={() => setFilter('Dev')}>Dev</button>
        <button onClick={() => setFilter('QA')}>QA</button>
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
            onDoubleClick={() => setHighlight(item)}
            style={{
              cursor: 'pointer',
              padding: 8,
              margin: 4,
              border: '1px solid #ccc',
              backgroundColor: uiState.selectedIds.includes(item.id)
                ? '#bbdefb'
                : item.id === uiState.highlightId
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
