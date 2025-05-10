import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏟 MatchMind</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/shoot')}>
          ⚽ 슛 예측 테스트
        </button>
        <button style={styles.button} onClick={() => navigate('/rankers')}>
          📊 랭커 정보 조회
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  title: {
    fontSize: '40px',
    marginBottom: '40px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
  },
  button: {
    padding: '20px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '8px',
    backgroundColor: '#0057ff',
    color: 'white',
    border: 'none',
  },
};
