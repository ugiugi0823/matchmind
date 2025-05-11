// src/components/PlayerSearch.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface Player {
  id: number;
  name: string;
}

export default function PlayerSearch({
  onSelect,
}: {
  onSelect: (id: number, name: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const fetchPlayers = debounce(async (q: string) => {
    try {
      console.log('[검색 요청]', q);
      const res = await axios.get(`/api/players?query=${encodeURIComponent(q)}`);
      console.log('[검색 결과]', res.data);
      setPlayers(res.data);
    } catch (err) {
      console.error('[검색 실패]', err);
    }
  }, 300);

  useEffect(() => {
    if (query.trim().length >= 2) {
      fetchPlayers(query);
    } else {
      setPlayers([]);
    }
  }, [query]);

  return (
    <div style={{ width: 300, marginBottom: 10 }}>
      <input
        type="text"
        placeholder="선수 이름 입력 (2자 이상)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      />
      {players.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: 150,
            overflowY: 'auto',
            background: '#000000',
            border: '1px solid #ccc',
          }}
        >
          {players.map((player) => (
            <li
              key={player.id}
              onClick={() => {
                onSelect(player.id, player.name);
                setQuery(player.name);
                setPlayers([]);
              }}
              style={{
                padding: 8,
                cursor: 'pointer',
                borderBottom: '1px solid #ddd',
              }}
            >
              {player.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
