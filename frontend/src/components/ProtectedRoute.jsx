import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ requireAdmin = false }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabase에서 현재 로그인된 세션 정보를 가져옴.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <div className="p-10 text-center">인증 정보 확인 중... ⏳</div>;

  // 비로그인 상태면 로그인(Auth) 페이지로 강제 이동
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // 관리자 권한이 필요한 페이지인데, 관리자 계정이 아닌 경우 차단
  // (테스트 편의를 위해 admin@test.com을 관리자 계정으로 고정)
  if (requireAdmin && session.user.email !== "admin@test.com") {
    alert("관리자 권한이 없습니다.");
    return <Navigate to="/books" replace />;
  }

  // 인증/권한 검사를 통과하면 원래 요청한 하위 컴포넌트(<Outlet />)를 보여줍니다.
  return <Outlet />;
}
