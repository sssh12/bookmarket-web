import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";

export default function WishlistPage() {
  const { wishlist, fetchWishlist, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  // 페이지 렌더링 시 DB에서 최신 찜 목록 가져오기
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
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
            찜한 상품이 없습니다
          </h3>
          <p className="text-gray-500 mb-6 text-center">
            관심 있는 도서에 하트를 눌러보세요.
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors active:scale-95 shadow-sm"
          >
            도서 목록 보러가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((book) => (
            <div
              key={book.bookId}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full relative group"
            >
              <button
                onClick={() => toggleWishlist(book)}
                className="absolute top-4 right-4 text-2xl z-10 drop-shadow-sm hover:scale-110 transition-transform"
                title="찜 취소"
              >
                ❤️
              </button>
              <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
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
                    className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                  >
                    담기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
