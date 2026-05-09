import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">유저 정보를 불러오는 중...</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-xl">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
        고객 정보
      </h2>

      {/* 구형 디자인에서 토스 스타일 카드 레이아웃으로 변경 */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            이메일
          </label>
          <div className="px-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 font-medium border border-gray-100">
            {user.email}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            이름
          </label>
          <div className="px-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 font-medium border border-gray-100">
            {user.user_metadata?.full_name || "미등록 (정보 수정 필요)"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            연락처
          </label>
          <div className="px-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 font-medium border border-gray-100">
            {user.user_metadata?.phone || "미등록 (정보 수정 필요)"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            가입 일자
          </label>
          <div className="px-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 font-medium border border-gray-100">
            {new Date(user.created_at).toLocaleDateString("ko-KR")}
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            onClick={() => navigate("/profile-edit")}
            className="w-1/2 bg-blue-50 text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-100 transition-colors active:scale-95"
          >
            정보 수정
          </button>
          <button
            onClick={handleLogout}
            className="w-1/2 bg-red-50 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-100 transition-colors active:scale-95"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
