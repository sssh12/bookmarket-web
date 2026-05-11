// ... 기존 임포트 유지
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addToCart = useCartStore((state) => state.addToCart);

  const { toggleWishlist, isInWishlist, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    // 페이지 마운트 시 DB와 찜 상태 동기화
    fetchWishlist();

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
  }, [fetchWishlist]);

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
  };

  const getOriginLabel = (origin) => {
    if (origin === "DOMESTIC") return "국내 도서";
    if (origin === "FOREIGN") return "해외 도서";
    return "구분 미지정";
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
      <div className="flex justify-center items-center min-h-[60vh] text-red-500 font-bold bg-gray-50">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        전체 도서 목록
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.bookId}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative group"
          >
            <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm font-medium">
                  이미지 준비중
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1 gap-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                  {book.title}
                </h3>
                <button
                  onClick={() => toggleWishlist(book)}
                  className="text-2xl drop-shadow-sm hover:scale-110 active:scale-90 transition-transform cursor-pointer shrink-0 leading-none"
                  title={isInWishlist(book.bookId) ? "찜 취소" : "찜하기"}
                >
                  {isInWishlist(book.bookId) ? "❤️" : "🖤"}
                </button>
              </div>

              <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                {book.author} · {book.publisher}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md">
                  {book.isbn || book.bookId}
                </span>
                <span className="bg-purple-50 text-purple-600 text-[11px] font-bold px-2 py-1 rounded-md">
                  {getOriginLabel(book.origin)}
                </span>
                <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-1 rounded-md">
                  {book.categoryName || "분야 미지정"}
                </span>
                {book.publishedAt && (
                  <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md">
                    출판일:{" "}
                    {new Date(book.publishedAt).toLocaleDateString("ko-KR")}
                  </span>
                )}
              </div>

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
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-95"
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
