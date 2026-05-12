import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { useCartStore } from "../store/cartStore.jsx";
import { useWishlistStore } from "../store/wishlistStore.jsx";
import { toast } from "sonner";

const CATEGORIES = [
  "전체",
  "소설/시/희곡",
  "IT/모바일",
  "경제/경영",
  "인문/사회",
  "자기계발",
  "과학",
  "만화/라이트노벨",
];

const ITEMS_PER_PAGE = 10;

export default function DomesticBookPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 검색, 필터링, 페이지네이션 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, wishlist, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
    api
      .get("/api/books")
      .then((response) => {
        if (Array.isArray(response.data)) {
          // 국내 도서만 필터링
          const domesticBooks = response.data.filter(
            (book) => book.origin === "DOMESTIC",
          );
          setBooks(domesticBooks);
        } else {
          setError("데이터 형식이 올바르지 않습니다.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 통신 에러:", err);
        setError("서버와 통신할 수 없습니다.");
        setLoading(false);
      });
  }, [fetchWishlist]);

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
  };

  const getOriginLabel = (origin) => {
    return origin === "DOMESTIC" ? "국내도서" : "해외도서";
  };

  // 검색어 또는 카테고리가 변경될 때 페이지를 1로 리셋
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  // 1. 데이터 필터링 로직 (검색어 + 카테고리)
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체"
        ? true
        : book.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 2. 페이지네이션 처리 로직
  // 항목이 없거나 10개 미만이어도 최소 1페이지는 보여주도록 Math.max(1, ...) 적용
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / ITEMS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-gray-500">
        데이터를 불러오는 중...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 font-bold text-red-500">{error}</div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🇰🇷</span>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          국내 도서
        </h2>
      </div>

      {/* [기능 추가] 검색 및 필터링 UI */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <input
            type="text"
            placeholder="도서명 또는 저자를 검색해보세요..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="shrink-0">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full md:w-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium cursor-pointer"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[40vh] mb-8">
          <p className="text-gray-500 font-medium text-lg">
            검색 조건에 맞는 도서가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {/* filteredBooks 대신 currentBooks를 매핑 */}
          {currentBooks.map((book) => {
            const isWished = wishlist.some(
              (item) => item.bookId === book.bookId,
            );
            return (
              <div
                key={book.bookId}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative"
              >
                <button
                  onClick={() => toggleWishlist(book)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                >
                  {isWished ? "❤️" : "🖤"}
                </button>
                <div className="aspect-3/4 w-full bg-gray-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
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
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
                    {book.title}
                  </h3>
                  {/* 저자 및 출판사 */}
                  <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                    {book.author}{" "}
                    {book.publisher && (
                      <span className="text-gray-400">| {book.publisher}</span>
                    )}
                  </p>

                  {/* 출판일 */}
                  {book.publishedAt && (
                    <p className="text-xs text-gray-700 mb-2 font-mono">
                      출판일:{" "}
                      {new Date(book.publishedAt).toLocaleDateString("ko-KR")}
                    </p>
                  )}

                  {/* 태그 (분야, 국내/해외, ISBN) */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {book.isbn && (
                      <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md">
                        {book.isbn}
                      </span>
                    )}
                    <span className="bg-purple-50 text-purple-600 text-[11px] font-bold px-2 py-1 rounded-md">
                      {getOriginLabel(book.origin)}
                    </span>
                    <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-1 rounded-md">
                      {book.categoryName || "분야 미지정"}
                    </span>
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
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    담기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* [기능 추가] 페이지네이션 UI (항상 노출) */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
            currentPage === 1
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
              currentPage === page
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
          disabled={currentPage === totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
            currentPage === totalPages
              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer shadow-sm"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
