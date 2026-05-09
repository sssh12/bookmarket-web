import { useCartStore } from "../store/cartStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setUserEmail(session.user.email);
        const metadata = session.user.user_metadata || {};
        setValue(
          "recipient",
          metadata.full_name || session.user.email.split("@")[0],
        );
        setValue("phone", metadata.phone || "");
      }
    });
  }, [setValue]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const onSubmit = async (data) => {
    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }
    try {
      const orderPayload = {
        userEmail: userEmail,
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
      await api.post("/api/orders", orderPayload);
      alert("주문이 성공적으로 완료되었습니다! 🎉");
      clearCart();
      navigate("/order-history"); // 결제 완료 후 주문 내역으로 이동
    } catch (error) {
      console.error("주문 처리 오류:", error);
      alert("주문 처리 중 문제가 발생했습니다.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          주문할 상품이 없어요
        </h2>
        <button
          onClick={() => navigate("/books")}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition"
        >
          도서 목록으로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        주문서 작성
      </h2>

      <div className="space-y-6">
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">배송지 정보</h3>
          <form
            id="orderForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                받는 분 (이름)
              </label>
              <input
                type="text"
                {...register("recipient", { required: true })}
                readOnly
                className="w-full px-4 py-3.5 bg-gray-100 text-gray-500 rounded-2xl border border-transparent outline-none cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                연락처
              </label>
              <input
                type="text"
                {...register("phone", { required: true })}
                readOnly
                className="w-full px-4 py-3.5 bg-gray-100 text-gray-500 rounded-2xl border border-transparent outline-none cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                배송 주소 <span className="text-blue-500">*</span>
              </label>
              <input
                type="text"
                {...register("address", { required: "배송지를 입력해주세요" })}
                placeholder="상세 주소를 입력해주세요"
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1.5 ml-1 font-medium">
                  {errors.address.message}
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">주문 상품</h3>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.bookId}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{item.title}</span>
                  <span className="text-sm text-gray-500">
                    {item.quantity}개
                  </span>
                </div>
                <span className="font-extrabold text-gray-800">
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">상품 금액</span>
              <span className="font-bold text-gray-800">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                최종 결제 금액
              </span>
              <span className="text-2xl font-extrabold text-blue-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          <button
            type="submit"
            form="orderForm"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-sm text-lg active:scale-[0.98] ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"}`}
          >
            {isSubmitting
              ? "결제 진행 중..."
              : `${totalPrice.toLocaleString()}원 결제하기`}
          </button>
        </section>
      </div>
    </div>
  );
}
