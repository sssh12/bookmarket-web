import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

export default function ProfileEditPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        setUserEmail(session.user.email);

        const response = await api.get(`/api/users/${session.user.email}`);
        const dbName = response.data.name;
        const emailPrefix = session.user.email.split("@")[0];

        const resolvedName =
          dbName && dbName !== emailPrefix
            ? dbName
            : session.user.user_metadata?.full_name || "";

        setName(resolvedName);
        // [수정] 백엔드에서 phoneNumber로 받도록 매핑
        setPhone(
          response.data.phoneNumber || session.user.user_metadata?.phone || "",
        );
        setAddress(response.data.address || "");
      } catch (error) {
        console.error("유저 정보 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: name, phone: phone },
      });
      if (authError) throw authError;

      // [수정] 백엔드 요청 시 phoneNumber 변수명 사용
      await api.put(`/api/users/${userEmail}/profile`, {
        name: name,
        phoneNumber: phone,
        address: address,
      });

      alert("정보가 성공적으로 수정되었습니다.");
      navigate("/profile");
    } catch (error) {
      console.error("정보 수정 실패:", error);
      alert("정보 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 font-bold text-gray-500">
        정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-xl">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        내 정보 수정
      </h2>

      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이메일 계정 (변경 불가)
            </label>
            <input
              type="text"
              value={userEmail}
              disabled
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-xl border border-gray-200 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="이름을 입력해주세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              연락처
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="01012345678"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              기본 배송지 주소
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="상세 배송지를 입력해주세요 (선택)"
            />
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition active:scale-[0.98] cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`flex-1 text-white font-bold py-4 rounded-2xl shadow-sm transition active:scale-[0.98] cursor-pointer ${
              saving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
