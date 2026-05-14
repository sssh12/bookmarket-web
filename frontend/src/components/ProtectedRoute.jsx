import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

// 로그인 여부와 관리자 권한을 검사해 접근을 제어하는 라우트 가드
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
        setRoleChecked(false);
        setRoleLoading(false);
        return;
      }

      setRoleChecked(false);
      setRoleLoading(true);

      console.log("PR session email:", session?.user?.email);

      const { data, error } = await supabase
        .from("user_tb")
        .select("role")
        .eq("email", session.user.email)
        .maybeSingle();

      console.log("PR role query:", { data, error });

      if (error) {
        console.error("role 조회 실패:", error);
        setUserRole(null);
      } else {
        setUserRole(data?.role ?? "USER");
      }

      setRoleLoading(false);
      setRoleChecked(true);
    };

    fetchRole();
  }, [session?.user?.email]);

  // role 조회 완료 전에는 무조건 대기
  if (loading || (session && (!roleChecked || roleLoading))) {
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
