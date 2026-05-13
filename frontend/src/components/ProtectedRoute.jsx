import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

export default function ProtectedRoute({ requireAdmin = false }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user?.email) {
        setUserRole(null);
        setRoleChecked(true);
        return;
      }

      setRoleChecked(false); // 세션 생겼을 때는 다시 미확인 상태로
      setRoleLoading(true);

      const { data, error } = await supabase
        .from("user_tb")
        .select("role")
        .eq("email", session.user.email)
        .single();

      if (!error) {
        setUserRole(data?.role ?? null);
      }

      setRoleLoading(false);
      setRoleChecked(true);
    };

    fetchRole();
  }, [session?.user?.email]);

  // role 조회 완료 전에는 무조건 대기
  if (
    loading ||
    (session && (!roleChecked || roleLoading || userRole === null))
  ) {
    return <div className="p-10 text-center">인증 정보 확인 중... ⏳</div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && userRole !== "ADMIN") {
    toast.error("관리자 권한이 없습니다.");
    return <Navigate to="/books" replace />;
  }

  return <Outlet />;
}
