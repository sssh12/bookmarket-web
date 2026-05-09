import { Link } from "react-router-dom";

export default function WishlistPage() {
  // 실제 구현 시 백엔드나 로컬 스토리지에서 찜한 상품 목록을 가져올 예정
  const wishlistItems = [];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
        찜한 상품
      </h2>

      {wishlistItems.length === 0 ? (
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
          {/* 향후 찜한 도서 카드 렌더링 영역 */}
        </div>
      )}
    </div>
  );
}
