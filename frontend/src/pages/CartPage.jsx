import { useEffect } from "react";
import { useCartStore } from "../store/cartStore.jsx";
import { Link } from "react-router-dom";

// 장바구니 페이지 UI 컴포넌트
export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, fetchCart } =
    useCartStore();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
          장바구니
        </h2>
        <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center min-h-[50vh] shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">
            장바구니에 담긴 상품이 없습니다.
          </h3>
          <p className="text-gray-500 mb-8 font-medium">
            원하는 도서를 찾아 장바구니에 담아보세요.
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-blue-700 transition active:scale-95"
          >
            도서 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
          장바구니
        </h2>
        <button
          onClick={() => clearCart()}
          className="text-sm font-bold text-gray-500 hover:text-red-500 bg-white hover:bg-red-50 px-4 py-2 rounded-xl transition-colors border border-gray-200 hover:border-red-200 shadow-sm active:scale-95 cursor-pointer mb-8"
        >
          전체 비우기
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        {items.map((item) => (
          <div
            key={item.bookId}
            className="flex flex-col sm:flex-row items-center py-6 border-b border-gray-100 last:border-b-0 gap-6"
          >
            {/* [개선] 박스 크기(w-20 h-28)는 유지하되, 이미지가 잘리지 않도록 object-contain 적용 */}
            <div className="w-20 h-28 bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-sm p-1">
              {item.coverImageUrl ? (
                <img
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-400 text-[10px] font-medium text-center">
                  이미지
                  <br />
                  준비중
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center w-full">
              <span className="text-xs font-bold text-gray-400 mb-1 bg-gray-50 px-2 py-0.5 rounded-md inline-block w-max">
                {item.isbn || item.bookId}
              </span>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                {item.title}
              </h3>
              <p className="text-gray-500 font-medium text-sm mb-3 sm:mb-0">
                단가: {item.price.toLocaleString()}원
              </p>
            </div>

            <div className="flex flex-row sm:flex-col md:flex-row items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shrink-0">
                <button
                  onClick={() => updateQuantity(item.bookId, -1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors active:bg-gray-300 font-medium cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.bookId, 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors active:bg-gray-300 font-medium cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="text-right shrink-0 min-w-25">
                <p className="text-xs text-gray-400 font-bold mb-0.5">
                  총 가격
                </p>
                <p className="text-xl font-extrabold text-blue-600">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.bookId)}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors active:scale-95 cursor-pointer shrink-0"
                title="삭제"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-gray-500 font-medium mb-1 text-center md:text-left">
            총 결제 금액
          </p>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {totalPrice.toLocaleString()}
            <span className="text-2xl font-bold ml-1">원</span>
          </div>
        </div>
        <Link
          to="/order"
          className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 active:scale-95 text-center"
        >
          주문하기
        </Link>
      </div>
    </div>
  );
}
