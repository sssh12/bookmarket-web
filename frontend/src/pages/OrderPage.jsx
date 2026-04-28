import { useCartStore } from "../store/cartStore";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // 로그인한 유저 이메일 상태 관리
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // 마운트 시 Supabase에서 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setUserEmail(session.user.email);
      }
    });
  }, []);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 백엔드와 실제 연동되도록 수정된 onSubmit
  const onSubmit = async (data) => {
    try {
      const orderPayload = {
        userEmail: userEmail, // 백엔드 user_tb 조회를 위해 이메일 전송
        recipient: data.recipient,
        phone: data.phone,
        address: data.address,
        totalPrice: totalPrice,
        items: items.map((item) => ({
          bookId: item.bookId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // 백엔드로 POST 요청 전송
      await axios.post("http://127.0.0.1:8080/api/orders", orderPayload);

      alert(
        `🎉 주문이 성공적으로 완료되었습니다!\n(총 결제 금액: ${totalPrice.toLocaleString()}원)`,
      );
      clearCart();
      navigate("/books");
    } catch (error) {
      console.error("주문 처리 중 에러 발생:", error);
      alert("서버 오류로 인해 주문에 실패했습니다.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-10 text-center h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          주문할 상품이 없습니다.
        </h2>
        <Link
          to="/books"
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          상품 목록으로 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">📦 주문/결제</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 왼쪽: 배송지 정보 입력 폼 */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-bold mb-4 text-gray-800">배송지 정보</h3>
          <form
            id="orderForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                받으시는 분
              </label>
              <input
                type="text"
                {...register("recipient", { required: "이름을 입력해주세요." })}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.recipient && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.recipient.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                연락처
              </label>
              <input
                type="text"
                placeholder="010-0000-0000"
                {...register("phone", { required: "연락처를 입력해주세요." })}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                배송 주소
              </label>
              <textarea
                rows="3"
                {...register("address", {
                  required: "배송받으실 주소를 입력해주세요.",
                })}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* 오른쪽: 주문 상품 요약 및 결제 버튼 */}
        <div className="bg-gray-50 p-6 rounded-lg shadow border h-fit">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            주문 상품 요약
          </h3>
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={item.bookId}
                className="flex justify-between items-center bg-white p-3 rounded border text-sm"
              >
                <span className="font-semibold truncate w-1/2">
                  {item.title}
                </span>
                <span className="text-gray-500">x {item.quantity}</span>
                <span className="font-bold text-blue-600">
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">상품 금액</span>
              <span className="font-semibold">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">배송비</span>
              <span className="font-semibold">0원 (무료배송)</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-lg font-bold text-gray-800">
                최종 결제 금액
              </span>
              <span className="text-2xl font-bold text-red-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          <button
            type="submit"
            form="orderForm"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition shadow-md text-lg ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSubmitting ? "처리 중..." : "결제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
