import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { useCartStore } from "../store/cartStore.jsx";
import { useWishlistStore } from "../store/wishlistStore.jsx";
import { toast } from "sonner";
import BookDetailModal from "../components/BookDetailModal";

// 베스트셀러 도서를 카테고리별로 보여주는 목록 화면
export default function BestsellerPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 현재 선택된 카테고리 상태 관리 (0은 '전체'를 의미)
  const [selectedCategory, setSelectedCategory] = useState(0);

  // [기능 추가] 모달 상태 관리
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 제공해주신 카테고리 데이터
  const categories = [
    { idx: 0, category_id: 1, category_name: "소설/시/희곡" },
    { idx: 1, category_id: 2, category_name: "IT/모바일" },
    { idx: 2, category_id: 3, category_name: "경제/경영" },
    { idx: 3, category_id: 4, category_name: "인문/사회" },
    { idx: 4, category_id: 5, category_name: "자기계발" },
    { idx: 5, category_id: 6, category_name: "과학" },
    { idx: 6, category_id: 7, category_name: "만화/라이트노벨" },
  ];

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, wishlist, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // [수정] useEffect 내부의 동기적 상태 변경(setLoading)을 제거하고 순수 데이터 Fetching만 담당
  useEffect(() => {
    let ignore = false; // 언마운트 시 상태 업데이트 방지용 플래그

    const endpoint =
      selectedCategory === 0
        ? "/api/books/bestsellers"
        : `/api/books/bestsellers?categoryId=${selectedCategory}`;

    api
      .get(endpoint)
      .then((response) => {
        if (!ignore) {
          if (Array.isArray(response.data)) {
            setBooks(response.data.slice(0, 5));
          } else {
            setError("데이터 형식이 올바르지 않습니다.");
          }
          setLoading(false); // 비동기 응답 후 상태 변경은 안전함
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("데이터 통신 에러:", err);
          setError("서버와 통신할 수 없습니다.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedCategory]);

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory !== categoryId) {
      setLoading(true); // [해결] 사용자의 '클릭 액션'에서 로딩 상태를 켬 (연쇄 렌더링 방지)
      setSelectedCategory(categoryId);
    }
  };

  // [기능 추가] 도서 클릭 시 모달 열기
  const openBookModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const getOriginLabel = (origin) => {
    return origin === "DOMESTIC" ? "국내도서" : "해외도서";
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex flex-col mb-8 gap-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            베스트셀러
          </h2>
        </div>

        {/* 카테고리 필터 칩 (Chip) UI */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleCategoryClick(0)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
              selectedCategory === 0
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            전체 분야
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => handleCategoryClick(cat.category_id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                selectedCategory === cat.category_id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-gray-500">
          실시간 판매량 데이터를 불러오는 중...
        </div>
      ) : error ? (
        <div className="text-center py-20 font-bold text-red-500">{error}</div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-gray-500 font-medium">
            해당 분야에 판매된 베스트셀러 도서가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book, index) => {
            const isWished = wishlist.some(
              (item) => item.bookId === book.bookId,
            );
            return (
              <div
                key={book.bookId}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md relative cursor-pointer hover:scale-101 active:scale-100 transition-all"
                onClick={() => openBookModal(book)}
              >
                {/* 랭킹 뱃지 */}
                <div
                  className={`absolute top-0 left-4 z-20 font-extrabold text-lg px-4 py-2.5 rounded-b-xl shadow-md text-white
                  ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-700" : "bg-blue-600"}
                `}
                >
                  {index + 1}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(book);
                  }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                >
                  {isWished ? "❤️" : "🖤"}
                </button>

                <div className="aspect-3/4 w-full bg-gray-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden pt-4">
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
                  {/* 제목 */}
                  <h3
                    className="text-lg font-bold text-gray-900 line-clamp-1 mb-1"
                    title={book.title}
                  >
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
                    <p className="text-xs text-gray-400 mb-2 font-mono">
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

                  {/* 설명 */}
                  <p
                    className="text-sm text-gray-600 line-clamp-2 leading-relaxed mt-auto mb-4"
                    title={book.description}
                  >
                    {book.description}
                  </p>
                </div>

                {/* 가격 및 담기 버튼 */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                    {book.price?.toLocaleString() || 0}원
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(book);
                    }}
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

      {/* [기능 추가] 도서 상세 모달 */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
