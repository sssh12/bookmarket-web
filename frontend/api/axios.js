import axios from "axios";

/**
 * 전역 Axios 인스턴스 설정
 * Vite 환경 변수(VITE_API_BASE_URL)를 활용하여 로컬 개발 환경과 클라우드 배포 환경의 주소를 동적으로 분리
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // 향후 JWT 쿠키 기반 인증 등을 대비해 자격 증명 옵션을 활성화
  withCredentials: true,
});

// 향후 UI/UX (예: 로딩 애니메이션 띄우기, 전역 에러 알림)를 위해
// Interceptor를 이곳에 추가할 예정.

export default api;
