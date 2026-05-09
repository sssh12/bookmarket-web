import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore.jsx";
import { supabase } from "../supabaseClient.js";

export default function Navbar({ session }) {
  const cartItems = useCartStore((state) => state.items) || [];
  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isAdmin = session?.user?.email === "admin@test.com";

  // ESLint 경고(no-useless-assignment) 해결 및 relatedPaths 찜한 상품 로직 유지
  const getMenuClass = (path, isSubMenu = false, relatedPaths = []) => {
    const isActive =
      path === "/"
        ? currentPath === "/"
        : isSubMenu
          ? currentPath === path
          : currentPath.startsWith(path) ||
            relatedPaths.some((p) => currentPath.startsWith(p));

    if (isSubMenu) {
      return `px-5 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700 font-bold"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`;
    }

    return `px-3 py-5 block transition-colors ${
      isActive
        ? "text-blue-600 font-bold"
        : "text-gray-600 font-medium hover:text-gray-900"
    }`;
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm relative z-50">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        {/* 좌측: 메인 메뉴 영역 */}
        <div className="flex items-center gap-2 md:gap-6">
          {!session ? (
            <Link to="/" className={getMenuClass("/")}>
              로그인
            </Link>
          ) : (
            <>
              {/* 1. 고객 정보 */}
              <div className="relative group cursor-pointer">
                <Link
                  to="/profile"
                  className={getMenuClass("/profile", false, ["/wishlist"])}
                >
                  고객 정보
                </Link>
                <div className="absolute top-14 left-0 w-40 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 flex flex-col overflow-hidden">
                    <Link
                      to="/profile"
                      className={getMenuClass("/profile", true)}
                    >
                      내 정보
                    </Link>
                    <Link
                      to="/profile-edit"
                      className={getMenuClass("/profile-edit", true)}
                    >
                      내 정보 수정
                    </Link>
                    <Link
                      to="/wishlist"
                      className={getMenuClass("/wishlist", true)}
                    >
                      찜한 상품
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. 상품 목록 */}
              <div className="relative group cursor-pointer">
                <Link to="/books" className={getMenuClass("/books")}>
                  상품 목록
                </Link>
                <div className="absolute top-14 left-0 w-40 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 flex flex-col overflow-hidden">
                    <Link to="/books" className={getMenuClass("/books", true)}>
                      전체 도서
                    </Link>
                    <Link
                      to="/books/bestseller"
                      className={getMenuClass("/books/bestseller", true)}
                    >
                      베스트셀러
                    </Link>
                    <Link
                      to="/books/new"
                      className={getMenuClass("/books/new", true)}
                    >
                      신간 도서
                    </Link>
                    <Link
                      to="/books/domestic"
                      className={getMenuClass("/books/domestic", true)}
                    >
                      국내 도서
                    </Link>
                    <Link
                      to="/books/foreign"
                      className={getMenuClass("/books/foreign", true)}
                    >
                      해외 도서
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. 장바구니 */}
              <div className="relative group cursor-pointer">
                <Link
                  to="/cart"
                  className={`${getMenuClass("/cart")} flex items-center gap-1.5`}
                >
                  장바구니
                  {totalQuantity > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
                <div className="absolute top-14 left-0 w-40 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 flex flex-col overflow-hidden">
                    <Link
                      to="/cart"
                      className={`${getMenuClass("/cart", true)} flex justify-between items-center`}
                    >
                      장바구니 가기
                      {totalQuantity > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {totalQuantity}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4. 주문하기 */}
              <div className="relative group cursor-pointer">
                <Link to="/order" className={getMenuClass("/order")}>
                  주문하기
                </Link>
                <div className="absolute top-14 left-0 w-40 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 flex flex-col overflow-hidden">
                    <Link to="/order" className={getMenuClass("/order", true)}>
                      주문/결제
                    </Link>
                    <Link
                      to="/order-history"
                      className={getMenuClass("/order-history", true)}
                    >
                      주문 내역 조회
                    </Link>
                  </div>
                </div>
              </div>

              {/* 5. 관리자 메뉴 */}
              {isAdmin && (
                <div className="relative group cursor-pointer">
                  <Link to="/admin" className={getMenuClass("/admin")}>
                    관리자
                  </Link>
                  <div className="absolute top-14 left-0 w-40 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 flex flex-col overflow-hidden">
                      <Link
                        to="/admin"
                        className={getMenuClass("/admin", true)}
                      >
                        신규 도서 등록
                      </Link>
                      <Link
                        to="/admin/books"
                        className={getMenuClass("/admin/books", true)}
                      >
                        도서 관리
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 우측 아이콘 */}
        {session && (
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm cursor-help">
                <span className="text-sm">👑</span>
                <span className="text-xs font-bold text-yellow-700">
                  관리자 모드
                </span>
              </div>
            ) : (
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
              >
                <span className="text-sm">👤</span>
                <span className="text-xs font-bold text-gray-600 line-clamp-1 max-w-20">
                  {session.user.user_metadata?.full_name || "회원"}
                </span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
