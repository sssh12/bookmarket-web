import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const authSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 최소 6자리 이상이어야 합니다." }),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [globalMessage, setGlobalMessage] = useState("");
  const navigate = useNavigate();

  // react-hook-form 설정 (Zod 리졸버 연동)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: "onChange", // 입력할 때마다 실시간으로 유효성 검사
  });

  const onSubmit = async (data) => {
    setGlobalMessage("처리 중... ⏳");
    const { email, password } = data;

    try {
      if (isLogin) {
        // 자체 로그인
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/books");
      } else {
        // 회원가입
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setGlobalMessage("회원가입 완료! 이제 로그인해주세요.");
        setIsLogin(true);
        reset(); // 폼 초기화
      }
    } catch (error) {
      setGlobalMessage(`에러: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    navigate("/books");
    if (error) setGlobalMessage(`구글 로그인 에러: ${error.message}`);
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "로그인" : "회원가입"}
        </h2>

        {globalMessage && (
          <p className="text-center text-sm text-red-500 mb-4">
            {globalMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              이메일
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
            />
            {/* Zod 유효성 검사 에러 메시지 출력 */}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
            />
            {/* Zod 유효성 검사 에러 메시지 출력 */}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-2 px-4 rounded transition ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} cursor-pointer`}
          >
            {isSubmitting ? "진행 중..." : isLogin ? "로그인" : "가입하기"}
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-50 transition cursor-pointer"
          >
            구글 소셜 로그인
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              reset(); // 모드 전환 시 폼 초기화
              setGlobalMessage("");
            }}
            className="text-sm text-gray-600 hover:text-gray-800 transition cursor-pointer hover:underline"
          >
            {isLogin ? (
              <>
                계정이 없으신가요?{" "}
                <span className="text-blue-600">회원 가입</span>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{" "}
                <span className="text-blue-600">로그인</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
