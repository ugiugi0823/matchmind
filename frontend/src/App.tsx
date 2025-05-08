import React, { useState } from 'react';
import FieldSelector from './components/FieldSelector';
import { predictShot } from './api';

function App() {
    const [x, setX] = useState(0.5);      // 기본값: 중앙
    const [y, setY] = useState(0.5);      // 기본값: 중앙
    const [spId, setSpId] = useState(829001551);
    const [spGrade, setSpGrade] = useState(8);   // 기본 등급
    const [spLevel, setSpLevel] = useState(5);   // 기본 레벨
    const [result, setResult] = useState('');

    const handlePredict = async () => {
        try {
            const res = await predictShot({ x, y, spId, spGrade, spLevel });
            setResult(`골 확률: ${res.goal_proba}, 예측 결과: ${res.goal_pred}`);
        } catch (error) {
            setResult('예측 요청에 실패했습니다.');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>슛 예측 테스트</h1>

            <FieldSelector onSelect={(clickedX, clickedY) => {
                setX(clickedX);
                setY(clickedY);
            }} />

            <p>필드를 클릭하거나 직접 x, y 값을 입력할 수 있습니다.</p>

            <label>X 좌표:</label><br />
            <input
                type="number"
                step="0.01"
                value={x}
                onChange={e => setX(+e.target.value)}
            /><br />

            <label>Y 좌표:</label><br />
            <input
                type="number"
                step="0.01"
                value={y}
                onChange={e => setY(+e.target.value)}
            /><br />

            <label>선수 ID (spId):</label><br />
            <input
                type="number"
                value={spId}
                onChange={e => setSpId(+e.target.value)}
            /><br />

            <label>선수 등급 (spGrade):</label><br />
            <input
                type="number"
                value={spGrade}
                onChange={e => setSpGrade(+e.target.value)}
            /><br />

            <label>선수 레벨 (spLevel):</label><br />
            <input
                type="number"
                value={spLevel}
                onChange={e => setSpLevel(+e.target.value)}
            /><br />

            <button onClick={handlePredict} style={{ marginTop: 10 }}>예측하기</button>

            <div style={{ marginTop: 20, fontWeight: 'bold' }}>{result}</div>
        </div>
    );
}

export default App;
