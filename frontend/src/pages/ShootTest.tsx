// src/pages/ShootTest.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FieldSelector from '../components/FieldSelector';

export default function ShootTest() {
  const [x, setX] = useState<number | null>(null);
  const [y, setY] = useState<number | null>(null);
  const [spId, setSpid] = useState<number | null>(null);
  const [spGrade, setSpGrade] = useState(3);
  const [spLevel, setSpLevel] = useState(5);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (x === null || y === null || spId === null) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    try {
      const res = await axios.post('/api/predict', {
        x,
        y,
        spId,
        spGrade,
        spLevel,
      });
      setResult(res.data);
      setError(null);
    } catch (err: any) {
      console.error('예측 실패:', err);
      setError('예측 중 오류가 발생했습니다.');
      setResult(null);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
      <h2>🎯 슈팅 예측 테스트</h2>

      <FieldSelector
        onSelect={(x, y) => {
          console.log("🎯 선택된 위치:", x, y);
          setX(x);
          setY(y);
        }}
        onPlayerSelect={(id, name) => {
          setSpid(id);
          console.log('선수 선택됨:', id, name);
        }}
      />

      <div style={{ marginBottom: 15 }}>
        <p>선택된 위치: X = <strong>{x}</strong>, Y = <strong>{y}</strong></p>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>
          강화 등급 (spGrade):
          <input
            type="number"
            value={spGrade}
            onChange={(e) => setSpGrade(Number(e.target.value))}
            min={1}
            max={5}
            style={{ marginLeft: 10, width: 50 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>
          선수 레벨 (spLevel):
          <input
            type="number"
            value={spLevel}
            onChange={(e) => setSpLevel(Number(e.target.value))}
            min={1}
            max={30}
            style={{ marginLeft: 10, width: 50 }}
          />
        </label>
      </div>

      <button onClick={handleSubmit} style={{ padding: '8px 20px' }}>
        예측 요청
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>📈 예측 결과</h3>
          <p>예상 골 확률: <strong>{(result.goal_proba * 100).toFixed(2)}%</strong></p>
          <p>예측 결과: {result.goal_pred ? '골 가능성 있음' : '골 가능성 낮음'}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <button onClick={() => navigate('/')}>🏠 홈으로</button>
        <button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
          🔙 뒤로가기
        </button>
      </div>
    </div>
  );
}
