import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useCartStore } from "../store/cartStore";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    api
      .get("/api/books")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          setError("데이터 형식이 올바르지 않습니다.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 통신 에러:", err);
        setError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">
          도서 목록을 불러오고 있어요...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-medium">
          {error}
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
        전체 도서
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.bookId}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
          >
            <div className="aspect-3/4 bg-gray-100 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden">
              <span className="text-gray-400 text-sm font-medium">
                이미지 준비중
              </span>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1 mb-1">
                {book.author} · {book.publisher}
              </p>
              {book.publishedAt && (
                <p className="text-xs text-gray-400 mb-3">
                  출판일:{" "}
                  {new Date(book.publishedAt).toLocaleDateString("ko-KR")}
                </p>
              )}
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mt-auto mb-4">
                {book.description}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                {book.price?.toLocaleString() || 0}원
              </span>
              <button
                onClick={() => handleAddToCart(book)}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors duration-200 active:scale-95"
              >
                담기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
