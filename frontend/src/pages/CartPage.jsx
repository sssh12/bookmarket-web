import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { Link } from "react-router-dom";

// 장바구니 페이지 UI 컴포넌트 (전역 상태에서 데이터 가져와서 보여줌)
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
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
          장바구니
        </h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 border border-gray-100 rounded-full mb-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42a27.75,27.75,0,0,0-2.71-12h-49.8a8,8,0,0,1-7.71-10.14l2.25-8.36H185a24,24,0,0,0,23.16-17.65l21.84-80A8,8,0,0,0,222.14,58.87ZM88,216a12,12,0,1,1-12-12A12,12,0,0,1,88,216Zm119.53-96.11a8,8,0,0,1-7.72,5.88H71.49l-14.54-54h153Z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">
            장바구니에 담긴 상품이 없습니다.
          </h3>
          <p className="text-gray-500 mb-8 font-medium">
            원하는 도서를 찾아 장바구니에 담아보세요.
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            도서 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛒</span>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            장바구니
          </h2>
        </div>
        <button
          onClick={() => clearCart()}
          className="text-sm font-bold text-gray-500 hover:text-red-500 bg-white hover:bg-red-50 px-4 py-2 rounded-xl transition-colors border border-gray-200 hover:border-red-200 shadow-sm active:scale-95 cursor-pointer"
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
            <div className="w-20 h-28 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-sm border border-gray-100 relative">
              {item.coverImageUrl ? (
                <img
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-[10px] font-medium">
                  이미지 준비중
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
