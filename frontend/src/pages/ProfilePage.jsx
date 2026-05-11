import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios.js";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          navigate("/");
          return;
        }

        const response = await api.get(`/api/users/${session.user.email}`);
        const dbName = response.data.name;
        const emailPrefix = session.user.email.split("@")[0];

        const resolvedName =
          dbName && dbName !== emailPrefix
            ? dbName
            : session.user.user_metadata?.full_name || "";

        setUserData({
          email: session.user.email,
          name: resolvedName,
          // [수정] phoneNumber로 매핑
          phone: response.data.phoneNumber || session.user.user_metadata?.phone,
          address: response.data.address,
        });
      } catch (error) {
        console.error("유저 정보 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center mt-20 font-bold text-gray-500">
        프로필 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        내 정보
      </h2>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm">
            {userData?.name?.charAt(0) || "👤"}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {userData?.name}
            </h3>
            <p className="text-gray-500 font-medium">{userData?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              이름
            </h4>
            <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              {userData?.name}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              이메일 계정
            </h4>
            <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              {userData?.email}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              연락처
            </h4>
            <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              {userData?.phone || (
                <span className="text-gray-400 italic">
                  등록된 연락처가 없습니다.
                </span>
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              기본 배송지
            </h4>
            <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              {userData?.address || (
                <span className="text-gray-400 italic">
                  등록된 배송지가 없습니다.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            to="/profile-edit"
            className="flex-1 bg-gray-100 text-gray-700 text-center font-bold py-3.5 rounded-2xl hover:bg-gray-200 transition active:scale-[0.98]"
          >
            정보 수정
          </Link>
          <Link
            to="/order-history"
            className="flex-1 bg-blue-600 text-white text-center font-bold py-3.5 rounded-2xl hover:bg-blue-700 shadow-sm transition active:scale-[0.98]"
          >
            주문 내역 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
