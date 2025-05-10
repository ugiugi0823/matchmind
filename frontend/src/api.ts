// API 요청 모듈
const BACKEND_URL = "http://localhost:8000";
const NEXON_API_URL = "https://open.api.nexon.com/fconline/v1/ranker-stats";
const NEXON_API_KEY = "test_20ba492927d7472f9d05f02d88110a3fbe9b55ff1001eb45e33f2ece766fe355efe8d04e6d233bd35cf2fabdeb93fb0d"; // 보통 .env 파일로 분리합니다.

/**
 * 슛 예측 백엔드 API 호출
 * @param data 사용자 입력 데이터 (예: 위치, 속도 등)
 */
// api.ts
export async function predictShoot(data: {
    x: number;
    y: number;
    spid: number;
    grade: number;
    level: number;
  }) {
    const res = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        x: data.x,
        y: data.y,
        spId: data.spid,
        spGrade: data.grade,
        spLevel: data.level,
      }),
    });
  
    if (!res.ok) throw new Error('예측 실패');
    return res.json();
  }
  
  
/**
 * 넥슨 Open API로부터 랭커들의 평균 스탯 조회
 */
// 기존 부분 대체
export async function getRankerStats(matchtype: number, players: { id: number; po: number }[]) {
    const headers = {
      'x-nxopen-api-key': 'test_20ba492927d7472f9d05f02d88110a3fbe9b55ff1001eb45e33f2ece766fe355efe8d04e6d233bd35cf2fabdeb93fb0d',
    };
  
    const encodedPlayers = encodeURIComponent(JSON.stringify(players));
    const url = `https://open.api.nexon.com/fconline/v1/ranker-stats?matchtype=${matchtype}&players=${encodedPlayers}`;
  
    // ✅ 요청 전 로그
    console.log('[NEXON API 요청]');
    console.log('matchtype:', matchtype);
    console.log('players:', players);
    console.log('encoded URL:', url);
  
    const res = await fetch(url, { headers });
  
    // ✅ 응답 상태 확인
    if (!res.ok) {
      const errorBody = await res.text(); // JSON 아닌 경우도 대비
      console.error('[NEXON API 실패]');
      console.error('상태 코드:', res.status);
      console.error('응답 내용:', errorBody);
      throw new Error('넥슨 API 호출 실패');
    }
  
    const json = await res.json();
  
    // ✅ 성공 결과 로그
    console.log('[NEXON API 성공 응답]', json);
    return json;
  }
  