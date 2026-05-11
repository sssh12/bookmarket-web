import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { supabase } from "../supabaseClient.js";
import { Link } from "react-router-dom";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        // 임시 빈 배열 로직에서 실제 API 연동으로 수정 (백엔드 추가 개발 필요)
        // 백엔드에 OrderController에 GET /api/orders?email={email} 엔드포인트가 생겼다는 가정 하에 활성화
        const response = await api.get(
          `/api/orders?email=${session.user.email}`,
        );

        // 응답이 정상 배열이면 세팅, 에러 방어 코드 추가
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
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
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
        주문 내역
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            아직 주문한 내역이 없어요
          </h3>
          <Link to="/books" className="text-blue-600 font-bold hover:underline">
            상품 둘러보기
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
                  주문번호: {order.orderId}
                </span>
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  주문완료
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold text-gray-900">
                  {order.items && order.items.length > 0
                    ? `${order.items[0].title} 외 ${order.items.length - 1}건`
                    : "주문 상품"}
                </h4>
                <p className="text-gray-500">
                  결제 금액:{" "}
                  <span className="font-bold text-gray-900">
                    {order.totalPrice?.toLocaleString()}원
                  </span>
                </p>
                <p className="text-sm text-gray-400">배송지: {order.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
