import { useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { getRankerStats } from '../api';
import rawSppositionData from '../metadata/spposition.json';
import matchtypeData from '../metadata/matchtype.json';
import { SpidEntry, SppositionEntry } from '../types/metadata';
import { useNavigate } from 'react-router-dom';

const sppositionData = rawSppositionData as SppositionEntry[];

interface PlayerInput {
  id: number | null;
  po: number;
}

export default function Rankers() {
  const [matchtypeName, setMatchtypeName] = useState('공식 경기');
  const [players, setPlayers] = useState<PlayerInput[]>([
    { id: null, po: sppositionData[0].spposition },
  ]);
  const [queries, setQueries] = useState<string[]>(['']);
  const [searchResults, setSearchResults] = useState<SpidEntry[][]>([[]]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPlayers = debounce(async (index: number, q: string) => {
    if (q.trim().length < 2) {
      updateSearchResults(index, []);
      return;
    }

    try {
      const encodedQuery = encodeURIComponent(q);
      const url = `/api/players?query=${encodedQuery}`;
      console.log(`[요청 시작] index=${index}, query="${q}" → ${url}`);

      const res = await axios.get(url);

      console.log('[응답 성공] 선수 수:', res.data.length);
      updateSearchResults(index, res.data);
    } catch (err: any) {
      console.error('[검색 실패]');
      console.error('message:', err.message);
      console.error('status:', err?.response?.status);
      console.error('response.data:', err?.response?.data);
      console.error('stack:', err.stack);
      updateSearchResults(index, []);
    }
  }, 300);

  const updateSearchResults = (index: number, results: SpidEntry[]) => {
    setSearchResults((prev) => {
      const updated = [...prev];
      while (updated.length <= index) updated.push([]);
      updated[index] = results;
      return updated;
    });
  };

  const handleQueryChange = (index: number, value: string) => {
    setQueries((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    fetchPlayers(index, value);
  };

  const handlePlayerSelect = (index: number, player: SpidEntry) => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[index].id = player.id;
      return updated;
    });
    setQueries((prev) => {
      const updated = [...prev];
      updated[index] = player.name;
      return updated;
    });
    updateSearchResults(index, []);
  };

  const addPlayer = () => {
    setPlayers([...players, { id: null, po: sppositionData[0].spposition }]);
    setQueries([...queries, '']);
    setSearchResults([...searchResults, []]);
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
    setQueries(queries.filter((_, i) => i !== index));
    setSearchResults(searchResults.filter((_, i) => i !== index));
  };

  const handlePositionChange = (index: number, value: string) => {
    const updated = [...players];
    updated[index].po = Number(value);
    setPlayers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const validPlayers = players.filter((p) => p.id !== null) as { id: number; po: number }[];
      const matchtype = matchtypeData.find((m) => m.desc === matchtypeName)?.matchtype ?? 52;
      const result = await getRankerStats(matchtype, validPlayers);
      const normalized = result.map((p: any) => ({ ...p, spId: p.spid }));
      setData(normalized);
    } catch (e) {
      console.error('API 호출 실패:', e);
      setError('데이터 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  const getPositionName = (code: number) =>
    sppositionData.find((p) => p.spposition === code)?.desc ?? `코드 ${code}`;

  return (
    <div style={{ padding: 30, maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>📊 랭커 유저의 평균 스탯 조회</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          Match Type:
          <select
            value={matchtypeName}
            onChange={(e) => setMatchtypeName(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            {matchtypeData.map((m) => (
              <option key={m.matchtype} value={m.desc}>
                {m.desc}
              </option>
            ))}
          </select>
        </label>
      </div>

      {players.map((player, index) => (
        <div key={index} style={{ marginBottom: 25 }}>
          <input
            type="text"
            placeholder="선수 이름 검색 (2자 이상)"
            value={queries[index]}
            onChange={(e) => handleQueryChange(index, e.target.value)}
            style={{ padding: 8, width: 240, marginRight: 10 }}
          />
          <select
            value={player.po}
            onChange={(e) => handlePositionChange(index, e.target.value)}
            style={{ marginRight: 10 }}
          >
            {sppositionData.map((p) => (
              <option key={p.spposition} value={p.spposition}>
                {p.desc}
              </option>
            ))}
          </select>
          <button onClick={() => removePlayer(index)}>삭제</button>

          {queries[index].length >= 2 && (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: 5,
                backgroundColor: '#000000',
                border: '1px solid #ccc',
                maxHeight: 120,
                overflowY: 'auto',
                width: 240,
              }}
            >
              {Array.isArray(searchResults[index]) && searchResults[index].length > 0 ? (
                searchResults[index].map((result) => (
                  <li
                    key={result.id}
                    onClick={() => handlePlayerSelect(index, result)}
                    style={{
                      padding: 6,
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {result.name}
                  </li>
                ))
              ) : (
                <li style={{ padding: 6, color: '#888' }}>검색 결과 없음</li>
              )}
            </ul>
          )}
        </div>
      ))}

      <button onClick={addPlayer} style={{ marginBottom: 10 }}>
        + 선수 추가
      </button>
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '조회 중...' : '조회하기'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length > 0 && (
        <table border={1} cellPadding={6} style={{ marginTop: 20, width: '100%' }}>
          <thead>
            <tr>
              <th>선수 ID</th>
              <th>포지션</th>
              <th>경기 수</th>
              <th>슛</th>
              <th>유효슛</th>
              <th>골</th>
              <th>어시스트</th>
              <th>패스성공/시도</th>
              <th>드리블성공/시도</th>
              <th>드리블거리</th>
              <th>태클</th>
              <th>블락</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={`${p.spid}-${p.spPosition}`}>
                <td>{p.spid}</td>
                <td>{getPositionName(p.spPosition)}</td>
                <td>{p.status.matchCount}</td>
                <td>{p.status.shoot}</td>
                <td>{p.status.effectiveShoot}</td>
                <td>{p.status.goal}</td>
                <td>{p.status.assist}</td>
                <td>
                  {p.status.passSuccess} / {p.status.passTry}
                </td>
                <td>
                  {p.status.dribbleSuccess} / {p.status.dribbleTry}
                </td>
                <td>{p.status.dribble}</td>
                <td>{p.status.tackle}</td>
                <td>{p.status.block}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <button onClick={() => navigate('/')}>🏠 홈으로</button>
        <button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
          🔙 뒤로가기
        </button>
      </div>
    </div>
  );
}
