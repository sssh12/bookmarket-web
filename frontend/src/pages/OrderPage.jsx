import { useState, useEffect } from "react";
import { useCartStore } from "../store/cartStore.jsx";
import api from "../../api/axios.js";
import { supabase } from "../supabaseClient.js";
import { useNavigate, Navigate } from "react-router-dom";

export default function OrderPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email);

        try {
          const res = await api.get(`/api/users/${session.user.email}`);

          const dbName = res.data.name;
          const emailPrefix = session.user.email.split("@")[0];
          const resolvedName =
            dbName && dbName !== emailPrefix
              ? dbName
              : session.user.user_metadata?.full_name || "";

          setRecipient(resolvedName);
          setPhone(
            res.data.phoneNumber || session.user.user_metadata?.phone || "",
          );

          if (res.data.address) {
            setShippingAddress(res.data.address);
          }
        } catch (error) {
          console.error("배송지 불러오기 실패:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleOrder = async () => {
    if (!recipient.trim()) {
      alert("수령인을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }
    if (!shippingAddress.trim()) {
      alert("배송지 주소를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      if (saveAsDefault && userEmail) {
        await api.put(`/api/users/${userEmail}/address`, {
          address: shippingAddress,
        });
      }

      const orderData = {
        userEmail: userEmail,
        totalPrice,
        recipient,
        phone,
        address: shippingAddress,
        shippingAddress: shippingAddress,
        items: items.map((item) => ({
          bookId: item.bookId,
          // [버그 수정 3] 구버전 로컬스토리지 캐시로 인해 title이나 price가 없을 경우를 대비한 방어 코드
          title: item.title || "도서명 누락 (이전 데이터)",
          quantity: item.quantity,
          price: item.price || 0,
        })),
      };

      await api.post("/api/orders", orderData);

      alert("주문이 성공적으로 완료되었습니다!");
      clearCart();
      navigate("/order-history");
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        주문/결제
      </h2>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
          주문 상품 정보
        </h3>
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.bookId}
              className="flex justify-between items-center text-sm font-medium"
            >
              <span className="text-gray-700 flex-1">
                {item.title} <span className="text-gray-400 mx-1">x</span>{" "}
                {item.quantity}
              </span>
              <span className="text-gray-900 font-bold">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <span className="text-gray-500 font-bold">총 결제 금액</span>
          <span className="text-2xl font-extrabold text-blue-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
          배송지 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              수령인
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
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
              placeholder="01012345678"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            배송지 주소
          </label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="상세 배송지를 입력해주세요"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer w-max">
          <input
            type="checkbox"
            checked={saveAsDefault}
            onChange={(e) => setSaveAsDefault(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-bold text-gray-600 select-none">
            기본 배송지로 설정할까요?
          </span>
        </label>
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-sm transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
      >
        {loading
          ? "결제 진행 중..."
          : `${totalPrice.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
}
