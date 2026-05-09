import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { supabase } from "../supabaseClient.js";
import { Link } from "react-router-dom";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 향후 백엔드의 GET /api/orders/{userEmail} API가 구현되면 실제로 데이터를 불러오게 될 로직
    // 현재는 API가 없으므로 프론트엔드 UI/UX 골격만 잡아둠.
    const fetchOrders = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        // 백엔드 API가 완성되면 아래 주석을 해제하여 사용
        // const response = await api.get(`/api/orders?email=${session.user.email}`);
        // setOrders(response.data);

        // 임시 빈 데이터 처리 (UI 확인용)
        setOrders([]);
      } catch (error) {
        console.error("주문 내역 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">
          주문 내역을 불러오고 있어요...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        주문 내역
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            주문 내역이 없습니다
          </h3>
          <p className="text-gray-500 mb-6 text-center">
            아직 주문하신 상품이 없네요.
            <br />
            마음에 드는 도서를 찾아보세요!
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors active:scale-95 shadow-sm"
          >
            도서 목록 보러가기
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                <span className="text-sm font-bold text-gray-500">
                  {order.createdAt}
                </span>
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  주문완료
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold text-gray-900">
                  {order.title} 등 {order.items.length}건
                </h4>
                <p className="text-gray-500">
                  결제 금액:{" "}
                  <span className="font-extrabold text-gray-900">
                    {order.totalPrice.toLocaleString()}원
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
