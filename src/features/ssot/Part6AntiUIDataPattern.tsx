import { useState } from 'react';
import { type Item } from './utils';
import { DATA } from './utils';

interface ItemWithUIData extends Item {
  isSelected: boolean;
  isHighlighted: boolean;
  isFiltered: boolean; // 👈 UI flag for visibilit
}

export default function AntiPatternUIFlagsInData() {
  const [filterRole, setFilterRole] = useState<string | null>(null);

  const [data, setData] = useState<ItemWithUIData[]>(
    DATA.map((item) => ({
      ...item,
      isSelected: false,
      isHighlighted: false,
      isFiltered: true, // 👈 initialize as visible
    }))
  );

  const applyFilter = (role: string | null) => {
    setFilterRole(role);
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        isFiltered: role ? item.role === role : true,
      }))
    );
  };

  const toggleSelect = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const setHighlight = (id: number | null) => {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        isHighlighted: item.id === id,
      }))
    );
  };

  const removeAlice = () => {
    setData((prev) => prev.filter((item) => item.name !== 'Alice'));
  };

  const addEve = () => {
    const nextId = Math.max(...data.map((d) => d.id)) + 1;
    const newUser = {
      id: nextId,
      name: 'Eve',
      role: 'QA',
      isSelected: false,
      isHighlighted: false,
      isFiltered: filterRole ? 'QA' === filterRole : true,
    };
    setData((prev) => [...prev, newUser]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>❌ Anti-Pattern: UI Flags in Data</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Filter:</strong>{' '}
        <button onClick={() => applyFilter(null)}>All</button>
        <button onClick={() => applyFilter('Dev')}>Dev</button>
        <button onClick={() => applyFilter('QA')}>QA</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setHighlight(1)}>🌟 Highlight Alice</button>
        <button onClick={addEve}>➕ Add Eve</button>
        <button onClick={removeAlice}>🗑️ Remove Alice</button>
      </div>

      <ul>
        {data
          .filter((item) => item.isFiltered)
          .map((item) => (
            <li
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              onDoubleClick={() => setHighlight(item.id)}
              style={{
                cursor: 'pointer',
                padding: 8,
                margin: 4,
                border: '1px solid #ccc',
                backgroundColor: item.isSelected
                  ? '#bbdefb'
                  : item.isHighlighted
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
          {data
            .filter((i) => i.isSelected)
            .map((i) => i.name)
            .join(', ') || 'None'}
        </p>
        <p>
          🌟 <strong>Highlighted Item:</strong>{' '}
          {data.find((i) => i.isHighlighted)?.name ?? 'None'}
        </p>
        <p>
          🔎 <strong>Filtered Items:</strong>{' '}
          {data
            .filter((i) => i.isFiltered)
            .map((i) => i.name)
            .join(', ') || 'Empty'}
        </p>
      </div>
    </div>
  );
}
