import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 로그인된 유저 정보를 가져옴
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user)
    return <div className="p-10 text-center">유저 정보를 불러오는 중...</div>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">고객 정보</h2>
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            이메일
          </label>
          <div className="p-3 bg-gray-100 rounded text-gray-800">
            {user.email}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            가입 일자
          </label>
          <div className="p-3 bg-gray-100 rounded text-gray-800">
            {new Date(user.created_at).toLocaleDateString("ko-KR")}
          </div>
        </div>

        <div className="pt-4 mt-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-2 rounded hover:bg-red-100 cursor-pointer transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
