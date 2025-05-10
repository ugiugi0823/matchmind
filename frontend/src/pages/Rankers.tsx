import { useState } from 'react';
import { getRankerStats } from '../api';
import rawSpidData from '../metadata/spid.json';
import rawSppositionData from '../metadata/spposition.json';
import matchtypeData from '../metadata/matchtype.json';
import { SpidEntry, SppositionEntry } from '../types/metadata';
import { useNavigate } from 'react-router-dom';

const spidData = [...(rawSpidData as SpidEntry[])].sort((a, b) =>
  a.name.localeCompare(b.name, 'ko')
);
const sppositionData = rawSppositionData as SppositionEntry[];

interface PlayerInput {
  id: number; // spid
  po: number; // spposition
}

export default function Rankers() {
  const [matchtypeName, setMatchtypeName] = useState('공식 경기');
//   const [players, setPlayers] = useState<PlayerInput[]>([{ id: spidData[0].id, po: sppositionData[0].spposition }]);
// 손흥민 ID 찾기
const son = spidData.find((p) => p.name.includes('손흥민'));

// 초기 상태 설정 (손흥민 없으면 첫 번째 선수 fallback)
const [players, setPlayers] = useState<PlayerInput[]>([
  {
    id: son?.id ?? spidData[0].id,
    po: sppositionData[0].spposition,
  },
]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getMatchtypeCode = (name: string): number => {
    return matchtypeData.find((m) => m.desc === name)?.matchtype ?? 52;
  };

  const handlePlayerChange = (index: number, field: keyof PlayerInput, value: string) => {
    const updated = [...players];
    updated[index][field] = Number(value);
    setPlayers(updated);
  };

  const addPlayer = () =>
    setPlayers([...players, { id: spidData[0].id, po: sppositionData[0].spposition }]);

  const removePlayer = (index: number) =>
    setPlayers(players.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const matchtype = getMatchtypeCode(matchtypeName);
      const result = await getRankerStats(matchtype, players);
      const normalized = result.map((p: any) => ({
        ...p,
        spId: p.spid,
      }));
      setData(normalized);
    } catch (e) {
      console.error('API 호출 실패:', e);
      setError('데이터 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  const getPlayerName = (id: number) =>
    spidData.find((p) => p.id === id)?.name ?? `ID ${id}`;

  const getPositionName = (code: number) =>
    sppositionData.find((p) => p.spposition === code)?.desc ?? `코드 ${code}`;

  return (
        <div
    style={{
        padding: 30,
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}>
        <img
            src="/assets/rankers_banner.jpg"
            alt="랭커 분석 배너"
            style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', marginBottom: '20px' }}
            />

      <h2>📊 TOP 10,000 랭커 유저가 사용한 선수의 20경기 평균 스탯을 조회</h2>

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
        <div key={index} style={{ marginBottom: 10 }}>
          <select
            value={player.id}
            onChange={(e) => handlePlayerChange(index, 'id', e.target.value)}
            style={{ marginRight: 10 }}
          >
            {spidData.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={player.po}
            onChange={(e) => handlePlayerChange(index, 'po', e.target.value)}
            style={{ marginRight: 10 }}
          >
            {sppositionData.map((p) => (
              <option key={p.spposition} value={p.spposition}>
                {p.desc}
              </option>
            ))}
          </select>

          <button onClick={() => removePlayer(index)}>삭제</button>
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
              <th>선수명</th>
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
                <td>{getPlayerName(p.spid)}</td>
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
      <div style={{ marginTop: 30 }}>
        <button onClick={() => navigate('/')}>🏠 홈으로</button>
        <button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>🔙 뒤로가기</button>
        </div>
    </div>
  );
}
