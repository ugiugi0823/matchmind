import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 30, maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
      <img
      src="/assets/rankers_banner.jpg"
      alt="랭커 배너"
      style={{
        width: '900px',
        height: '300px', // 원하는 높이로 조정
        objectFit: 'cover', // 중앙 잘라내기 방식
        display: 'block',
        margin: '0 auto 30px auto',
        borderRadius: '8px',
      }}
      />
      <h1>⚽ MatchMind</h1>
      <p>랭커 선수 통계와 슈팅 예측 테스트를 해보세요!</p>

      <button
        onClick={() => navigate('/rankers')}
        style={{ padding: '12px 24px', marginTop: 20, fontSize: 16 }}
      >
        📊 랭커 통계 보기
      </button>

      <button
        onClick={() => navigate('/shoot')}
        style={{ padding: '12px 24px', marginTop: 20, marginLeft: 10, fontSize: 16 }}
      >
        🎯 슈팅 예측 테스트
      </button>
    </div>
  );
}
