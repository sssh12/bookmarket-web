import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 최소 6자리 이상이어야 합니다." }),
});

const signUpSchema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z
      .string()
      .min(6, { message: "비밀번호는 최소 6자리 이상이어야 합니다." }),
    passwordConfirm: z
      .string()
      .min(6, { message: "비밀번호 확인을 입력해주세요." }),
    name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
    phone: z.string().regex(/^[0-9]{10,11}$/, {
      message: "연락처는 숫자 10~11자리로 입력해주세요. (예: 01012345678)",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [globalMessage, setGlobalMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setGlobalMessage("처리 중... ⏳");
    const { email, password, name, phone } = data;

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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
            },
          },
        });

        if (error) throw error;

        setGlobalMessage("회원가입이 완료되었습니다.");
        toast.success("회원가입이 완료되었습니다.");
        setIsLogin(true);
        reset();
      }
    } catch (error) {
      setGlobalMessage("");
      console.error(error);
      toast.error(`[오류] ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/books",
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("구글 로그인 실패:", error.message);
      toast.error("구글 로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        {/* 상단 타이틀 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? "환영합니다" : "회원 가입"}
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {isLogin
              ? "도서 마켓에 로그인하고 쇼핑을 즐기세요."
              : "몇 가지 정보를 입력해주세요."}
          </p>
        </div>

        {/* 안내 메시지 */}
        {globalMessage && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-2xl text-sm font-bold text-center">
            {globalMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* 공통 이메일 필드 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              {...register("email")}
              className={`w-full px-4 py-3.5 bg-gray-50 rounded-2xl border outline-none transition-all font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 ${
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* 회원가입 시에만 보이는 이름/연락처 필드 */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  {...register("name")}
                  className={`w-full px-4 py-3.5 bg-gray-50 rounded-2xl border outline-none transition-all font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 ${
                    errors.name
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  연락처 (- 제외)
                </label>
                <input
                  type="text"
                  placeholder="01012345678"
                  {...register("phone")}
                  className={`w-full px-4 py-3.5 bg-gray-50 rounded-2xl border outline-none transition-all font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 ${
                    errors.phone
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full px-4 py-3.5 bg-gray-50 rounded-2xl border outline-none transition-all font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 ${
                errors.password
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 회원가입 시에만 보이는 비밀번호 확인 필드 */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("passwordConfirm")}
                className={`w-full px-4 py-3.5 bg-gray-50 rounded-2xl border outline-none transition-all font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 ${
                  errors.passwordConfirm
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.passwordConfirm && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-4 mt-2 rounded-2xl transition-all duration-200 text-lg active:scale-95 cursor-pointer shadow-sm ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            {isSubmitting ? "처리 중..." : isLogin ? "로그인" : "가입 완료"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <hr className="w-full border-gray-100" />
          <span className="p-2 text-xs text-gray-400 font-medium whitespace-nowrap">
            또는
          </span>
          <hr className="w-full border-gray-100" />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3.5 mt-6 rounded-2xl hover:bg-gray-50 transition-colors active:scale-95 cursor-pointer shadow-sm"
        >
          {/* 구글 로고 SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 시작하기
        </button>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              reset();
              setGlobalMessage("");
            }}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition cursor-pointer"
          >
            {isLogin ? (
              <>
                계정이 없으신가요?{" "}
                <span className="text-blue-600 font-bold ml-1">회원가입</span>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{" "}
                <span className="text-blue-600 font-bold ml-1">로그인</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
