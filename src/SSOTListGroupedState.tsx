import { useMemo, useState, useEffect } from 'react';
import { type Item } from './utils';

interface Props {
  listData: Item[];
}

type UIState = {
  selectedIds: number[];
  highlightId: number | null;
  filterRole: string | null;
};

export default function SSOTListGroupedState(props: Props) {
  // 🔵 Data State
  const [data, setData] = useState<Item[]>(props.listData);

  // 🟠 Grouped UI State
  const [uiState, setUIState] = useState<UIState>({
    selectedIds: [],
    highlightId: null,
    filterRole: null,
  });

  useEffect(() => {
    setData(props.listData);
  }, [props.listData]);

  // 🟣 Derived Views
  const filteredItems = useMemo(() => {
    return uiState.filterRole
      ? data.filter((d) => d.role === uiState.filterRole)
      : data;
  }, [data, uiState.filterRole]);

  const selectedItems = useMemo(() => {
    return data.filter((d) => uiState.selectedIds.includes(d.id));
  }, [data, uiState.selectedIds]);

  const highlightItem = useMemo(() => {
    return data.find((d) => d.id === uiState.highlightId) ?? null;
  }, [data, uiState.highlightId]);

  // 🧩 Handlers
  const toggleSelect = (id: number) => {
    setUIState((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter((i) => i !== id)
        : [...prev.selectedIds, id],
    }));
  };

  const setFilter = (role: string | null) => {
    setUIState((prev) => ({ ...prev, filterRole: role }));
  };

  const setHighlight = (id: number | null) => {
    setUIState((prev) => ({ ...prev, highlightId: id }));
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Filter:</strong>{' '}
        <button onClick={() => setFilter(null)}>All</button>
        <button onClick={() => setFilter('Dev')}>Dev</button>
        <button onClick={() => setFilter('QA')}>QA</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>Highlight:</strong>{' '}
        <button onClick={() => setHighlight(3)}>
          Highlight Charlie (id=3)
        </button>{' '}
        <button onClick={() => setHighlight(null)}>Clear Highlight</button>
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
              backgroundColor: uiState.selectedIds.includes(item.id)
                ? '#bbdefb'
                : uiState.highlightId === item.id
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
