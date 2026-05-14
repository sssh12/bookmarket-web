import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { toast } from "sonner";

// 선택한 도서의 상세 정보와 장바구니, 찜하기 기능을 보여주는 모달
export default function BookDetailModal({ book, isOpen, onClose }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, wishlist } = useWishlistStore();

  // 모달이 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const isWished = wishlist.some((item) => item.bookId === book.bookId);

  const handleAddToCart = () => {
    addToCart(book);
    onClose();
    toast.success(`[${book.title}] 도서가 장바구니에 담겼습니다.`);
  };

  const getOriginLabel = (origin) => {
    return origin === "DOMESTIC"
      ? "국내도서"
      : origin === "FOREIGN"
        ? "해외도서"
        : "기타";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full z-20 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* 좌측: 책 표지 이미지 */}
        <div className="md:w-2/5 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 min-h-75 md:min-h-125 shrink-0">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="max-w-full max-h-full object-contain rounded-xl shadow-lg drop-shadow-md"
            />
          ) : (
            <div className="text-gray-400 font-medium text-center bg-gray-100 w-48 h-64 flex items-center justify-center rounded-xl shadow-inner">
              이미지 준비중
            </div>
          )}
        </div>

        {/* 우측: 책 상세 정보 */}
        <div className="md:w-3/5 p-8 flex flex-col relative">
          <div className="flex flex-wrap gap-2 mb-4 shrink-0">
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-md">
              {book.categoryName || "분야 미지정"}
            </span>
            <span className="bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1.5 rounded-md">
              {getOriginLabel(book.origin)}
            </span>
            {book.isbn && (
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-md">
                ISBN: {book.isbn}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2 pr-8 shrink-0">
            {book.title}
          </h2>

          <div className="flex flex-wrap items-center text-gray-600 font-medium mb-6 gap-x-4 gap-y-2 text-sm md:text-base shrink-0">
            <p>
              <span className="text-gray-400 mr-2">저자</span>
              {book.author}
            </p>
            {book.publisher && (
              <>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <p>
                  <span className="text-gray-400 mr-2">출판사</span>
                  {book.publisher}
                </p>
              </>
            )}
            {book.publishedAt && (
              <>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <p>
                  <span className="text-gray-400 mr-2">출판일</span>
                  {new Date(book.publishedAt).toLocaleDateString("ko-KR")}
                </p>
              </>
            )}
          </div>

          <div className="mb-8 flex-1 flex flex-col min-h-0">
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 shrink-0">
              책 소개
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base bg-gray-50/50 p-4 rounded-xl overflow-y-auto max-h-75 md:max-h-100 overscroll-contain">
              {book.description || "등록된 책 소개가 없습니다."}
            </p>
          </div>

          {/* 하단 고정 영역: 가격 및 액션 버튼 */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shrink-0">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-400 mb-1">
                판매가
              </span>
              <span className="text-3xl font-black text-blue-600 tracking-tighter">
                {book.price?.toLocaleString() || 0}
                <span className="text-xl font-bold ml-1 text-gray-900">원</span>
              </span>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => toggleWishlist(book)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-200 cursor-pointer border-2 ${
                  isWished
                    ? "bg-red-50 border-red-100 text-red-500 hover:bg-red-100"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isWished ? "❤️" : "🖤"}
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-2 sm:flex-none bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold transition-colors cursor-pointer shadow-md"
              >
                장바구니 담기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
