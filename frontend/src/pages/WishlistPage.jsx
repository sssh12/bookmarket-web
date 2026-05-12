import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore.jsx";
import { useCartStore } from "../store/cartStore.jsx";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function WishlistPage() {
  const { wishlist, fetchWishlist, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // 페이지네이션 처리 로직
  const totalPages = Math.max(1, Math.ceil(wishlist.length / ITEMS_PER_PAGE));

  // 현재 페이지가 최대 페이지를 넘지 않도록 렌더링 시점에 보정
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const currentWishlist = wishlist.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleToggleWishlist = (book) => {
    toggleWishlist(book);

    // 찜 해제 시 현재 페이지의 마지막 항목이었다면 이전 페이지로 이동되도록 상태 업데이트
    const isRemoving = wishlist.some((item) => item.bookId === book.bookId);
    if (isRemoving && currentWishlist.length === 1 && validPage > 1) {
      setCurrentPage(validPage - 1);
    } else if (currentPage !== validPage) {
      setCurrentPage(validPage);
    }
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
        찜한 상품
      </h2>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            찜한 상품이 없습니다.
          </h3>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            관심 있는 도서를 찜해보세요!
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-blue-700 transition"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 전체 wishlist 대신 currentWishlist 매핑 */}
            {currentWishlist.map((book) => (
              <div
                key={book.bookId}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full relative group"
              >
                <button
                  onClick={() => handleToggleWishlist(book)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors cursor-pointer"
                  title="찜 해제"
                >
                  ❤️
                </button>
                <div className="aspect-3/4 w-full bg-gray-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">
                      이미지 준비중
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 pr-6">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                    {book.author}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-lg font-extrabold text-gray-900">
                      {book.price?.toLocaleString()}원
                    </span>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      담기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* [기능 추가] 페이지네이션 UI (항목이 적어도 항상 1페이지 노출) */}
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
    </div>
  );
}
