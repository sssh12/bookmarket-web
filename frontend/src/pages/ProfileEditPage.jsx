import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function ProfileEditPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        // 메타데이터에서 기존 정보를 불러와 폼에 초기값으로 세팅
        setValue("name", user.user_metadata?.full_name || "");
        setValue("phone", user.user_metadata?.phone || "");
      }
      setLoading(false);
    });
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      // Supabase user_metadata 업데이트
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.name,
          phone: data.phone,
        },
      });

      if (error) throw error;

      alert("개인정보가 성공적으로 수정되었습니다.");
      navigate("/profile"); // 수정 완료 후 내 정보 페이지로 이동
    } catch (error) {
      console.error("정보 수정 오류:", error);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        정보를 불러오는 중...
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-xl">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
        내 정보 수정
      </h2>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이메일 (수정 불가)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-3.5 bg-gray-100 text-gray-500 rounded-2xl border border-transparent outline-none cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              {...register("name", { required: "이름을 입력해주세요" })}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1.5 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              연락처
            </label>
            <input
              type="text"
              {...register("phone", {
                required: "연락처를 입력해주세요",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "숫자만 10~11자리 입력해주세요",
                },
              })}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1.5 ml-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-1/3 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors active:scale-95 disabled:bg-gray-400"
            >
              {isSubmitting ? "수정 중..." : "수정 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
