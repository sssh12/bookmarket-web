import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { supabase } from "../supabaseClient.js";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);

  // 영수증 모달 상태 관리
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const response = await api.get(
          `/api/orders?email=${session.user.email}`,
        );

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

  // 모달 상태에 따라 body 스크롤을 제어하는 부수 효과(Side Effect) 로직
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 컴포넌트가 언마운트되거나 의존성이 변경될 때 스크롤 복구
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedOrder]);

  const openReceipt = (order) => {
    setSelectedOrder(order);
  };

  const closeReceipt = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 페이지네이션 계산 로직
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    <div className="container mx-auto p-4 md:p-8 max-w-7xl relative">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
        주문 내역
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-5xl mb-4">📦</div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            아직 주문한 내역이 없습니다.
          </h3>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            원하는 도서를 찾아 주문해보세요.
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-blue-700 transition"
          >
            도서 둘러보기
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {/* 전체 orders 대신 currentOrders 매핑 */}
            {currentOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
              >
                <div className="flex flex-wrap justify-between items-center border-b border-gray-50 pb-4 mb-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-500">
                      주문일자: {formatDate(order.orderDate)}
                    </span>
                    <span className="text-xs font-mono text-gray-400 mt-1">
                      주문번호: {order.orderId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                      {order.status === "PENDING" ? "주문접수" : order.status}
                    </span>
                    <button
                      onClick={() => openReceipt(order)}
                      className="text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      영수증 보기
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-gray-900">
                    {order.items && order.items.length > 0
                      ? order.items.length === 1
                        ? order.items[0].title
                        : `${order.items[0].title} 외 ${order.items.length - 1}건`
                      : "주문 상품"}
                  </h4>
                  <p className="text-gray-500">
                    결제 금액:{" "}
                    <span className="font-bold text-gray-900">
                      {order.totalPrice?.toLocaleString()}원
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    배송지: {order.address}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* [기능 추가] 페이지네이션 UI (항상 노출) */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={validPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                validPage === 1
                  ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer shadow-sm"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors shadow-sm cursor-pointer ${
                  validPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={validPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                validPage === totalPages
                  ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer shadow-sm"
              }`}
            >
              &gt;
            </button>
          </div>
        </>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeReceipt}></div>

          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 p-6 border-b border-gray-200 text-center relative">
              <button
                onClick={closeReceipt}
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-2xl font-black text-gray-900 tracking-wider">
                RECEIPT
              </h3>
              <p className="text-sm text-gray-500 mt-2 font-mono">
                {formatDate(selectedOrder.orderDate)}
              </p>
              <p className="text-xs text-gray-400 font-mono mt-1">
                NO. {selectedOrder.orderId}
              </p>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-800 border-b border-black pb-2 mb-3">
                  주문 상품
                </p>
                <ul className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col text-sm text-gray-700"
                    >
                      <span className="font-medium line-clamp-2">
                        {item.title}
                      </span>
                      <div className="flex justify-between items-center text-gray-500 mt-1">
                        <span>
                          {item.price?.toLocaleString()}원 x {item.quantity}
                        </span>
                        <span className="font-bold text-gray-900">
                          {(item.price * item.quantity).toLocaleString()}원
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-gray-800 border-b border-black pb-2 mb-3">
                  배송 정보
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="text-gray-500 inline-block w-16">
                      수령인
                    </span>{" "}
                    {selectedOrder.recipient}
                  </p>
                  <p>
                    <span className="text-gray-500 inline-block w-16">
                      연락처
                    </span>{" "}
                    {selectedOrder.phone}
                  </p>
                  <p>
                    <span className="text-gray-500 inline-block w-16 align-top">
                      배송지
                    </span>{" "}
                    <span className="inline-block w-[calc(100%-4rem)]">
                      {selectedOrder.address}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-dashed border-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 text-lg">TOTAL</span>
                <span className="text-2xl font-black text-blue-600 tracking-tighter">
                  {selectedOrder.totalPrice?.toLocaleString()}원
                </span>
              </div>
              <button
                onClick={closeReceipt}
                className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
