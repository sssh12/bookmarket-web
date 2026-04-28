import { useState, useEffect } from "react";
import axios from "axios";
import { useCartStore } from "../store/cartStore";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 스토어에서 장바구니 추가 액션 함수를 가져옴
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/api/books")
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
        setError("백엔드 서버와 통신할 수 없습니다.");
        setLoading(false);
      });
  }, []);

  // 장바구니 담기 버튼 클릭 핸들러
  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-xl">데이터를 불러오는 중... ⏳</div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-xl text-red-500">
        에러 발생: {error}
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">도서 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.bookId}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
              <span className="text-gray-500">이미지 준비중</span>
            </div>
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {book.author} | {book.publisher}
            </p>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
              {book.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold">
                {book.price?.toLocaleString() || 0}원
              </span>

              {/* 장바구니 담기 버튼 */}
              <button
                onClick={() => handleAddToCart(book)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
