import { useCartStore } from "../store/cartStore";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">
          장바구니가 비어있어요
        </h2>
        <p className="text-gray-500 mb-8 font-medium">
          원하는 도서를 장바구니에 담아보세요.
        </p>
        <Link
          to="/books"
          className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 active:scale-95"
        >
          도서 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          장바구니
        </h2>
        <button
          onClick={clearCart}
          className="text-gray-500 hover:text-red-500 font-medium text-sm transition-colors cursor-pointer"
        >
          전체 비우기
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.bookId}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-md"
          >
            <div className="w-full md:w-24 h-32 bg-gray-100 rounded-2xl flex shrink-0 items-center justify-center text-sm text-gray-400">
              이미지
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                개당 {item.price.toLocaleString()}원
              </p>
              <div className="text-xl font-extrabold text-blue-600 tracking-tight">
                {(item.price * item.quantity).toLocaleString()}원
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.bookId, -1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors active:bg-gray-300 font-medium cursor-pointer"
                  disabled={item.quantity <= 1}
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
              <button
                onClick={() => removeFromCart(item.bookId)}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors active:scale-95 cursor-pointer"
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
          className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg text-center shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 active:scale-95"
        >
          주문하기
        </Link>
      </div>
    </div>
  );
}
