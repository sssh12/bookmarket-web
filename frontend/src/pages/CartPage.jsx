import { useCartStore } from "../store/cartStore";
import { Link } from "react-router-dom";

export default function CartPage() {
  // Zustand 스토어에서 상태와 액션 함수들
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();

  // 총 결제 금액 계산 (reduce 활용)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 장바구니가 비어있을 경우 보여줄 화면
  if (items.length === 0) {
    return (
      <div className="container mx-auto p-10 text-center h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          장바구니가 비어있습니다.
        </h2>
        <p className="text-gray-500 mb-6">
          원하는 도서를 장바구니에 담아보세요.
        </p>
        <Link
          to="/books"
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">🛒 장바구니</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">상품정보</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                수량
              </th>
              <th className="p-4 font-semibold text-gray-600 text-right">
                가격
              </th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.bookId} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-16 h-20 bg-gray-200 rounded shrink-0 flex items-center justify-center mr-4">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.author}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.bookId, -1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.bookId, 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-4 text-right font-bold text-blue-600">
                  {(item.price * item.quantity).toLocaleString()}원
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => removeFromCart(item.bookId)}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm px-3 py-1 border border-red-500 rounded hover:bg-red-50 transition"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-6 bg-gray-50 border-t flex flex-col md:flex-row justify-between items-center">
          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-red-600 text-sm mb-4 md:mb-0"
          >
            장바구니 전체 비우기
          </button>

          <div className="flex items-center space-x-6">
            <span className="text-lg font-semibold text-gray-600">
              총 결제 금액:
            </span>
            <span className="text-2xl font-bold text-blue-700">
              {totalPrice.toLocaleString()}원
            </span>
            <Link
              to="/order"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition font-bold text-lg"
            >
              주문하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
