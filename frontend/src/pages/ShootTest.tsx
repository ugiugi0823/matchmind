import { useState } from 'react';
import { predictShoot } from '../api';
import FieldSelector from '../components/FieldSelector';
import rawSpidData from '../metadata/spid.json';
import { SpidEntry } from '../types/metadata';
import { useNavigate } from 'react-router-dom';


const spidData = [...(rawSpidData as SpidEntry[])].sort((a, b) =>
  a.name.localeCompare(b.name, 'ko')
);

export default function ShootTest() {
  const [coords, setCoords] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [spid, setSpid] = useState<number>(spidData[0]?.id ?? 0);
  const [grade, setGrade] = useState<number>(1);
  const [level, setLevel] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelect = (x: number, y: number) => {
    setCoords({ x, y });
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (coords.x === null || coords.y === null) {
      setError('필드를 클릭해 좌표를 선택하세요.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await predictShoot({
        x: coords.x,
        y: coords.y,
        spid,
        grade,
        level,
      });
      setResult(`확률: ${res.goal_proba}, 예측: ${res.goal_pred ? '성공' : '실패'}`);
    } catch (err) {
      setError('예측 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>⚽ 슛 예측 테스트</h2>

      <FieldSelector onSelect={handleSelect} />

      <div style={styles.form}>
        <div>
          <label>선수명:&nbsp;</label>
          <select value={spid} onChange={(e) => setSpid(Number(e.target.value))}>
            {spidData.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>강화 등급:&nbsp;</label>
          <select value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label>레벨:&nbsp;</label>
          <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <p>좌표: {coords.x !== null ? `${coords.x}, ${coords.y}` : '선택 안 됨'}</p>
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? '예측 중...' : '예측하기'}
        </button>

        {result && <p style={styles.result}>✅ 예측 결과: {result}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={{ marginTop: 30 }}>
        <button onClick={() => navigate('/')}>🏠 홈으로</button>
        <button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>🔙 뒤로가기</button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
    marginTop: 20,
  },
  result: {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007700',
  },
  error: {
    marginTop: '20px',
    color: 'red',
  },
};
