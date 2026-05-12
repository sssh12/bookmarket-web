import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

export default function ProtectedRoute({ requireAdmin = false }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <div className="p-10 text-center">인증 정보 확인 중... ⏳</div>;

  if (!session) {
    return <Navigate to="/" replace />;
  }

  // 관리자 권한이 필요한 페이지인데, 관리자 계정이 아닌 경우 차단
  if (requireAdmin && session.user.email !== "admin@test.com") {
    toast.error("관리자 권한이 없습니다.");
    return <Navigate to="/books" replace />;
  }

  return <Outlet />;
}
