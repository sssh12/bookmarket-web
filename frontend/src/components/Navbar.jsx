import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { supabase } from "../supabaseClient";

// App.jsx에서 session을 props로 받아옵니다.
export default function Navbar({ session }) {
  const cartItems = useCartStore((state) => state.items) || [];
  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );
  const navigate = useNavigate();

  // 상단 네비게이션 바에서 직접 로그아웃 하는 함수
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // 현재 로그인한 사람이 관리자인지 확인
  const isAdmin = session?.user?.email === "admin@test.com";

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/books" className="text-xl font-bold">
          📚 BookMarket
        </Link>
        <div className="space-x-6 flex items-center">
          {/* 비로그인 상태일 때 보여줄 메뉴 */}
          {!session ? (
            <Link to="/" className="hover:text-blue-200">
              로그인
            </Link>
          ) : (
            /* 로그인 상태일 때 보여줄 메뉴들 */
            <>
              <Link to="/profile" className="hover:text-blue-200">
                고객 정보
              </Link>
              <Link to="/books" className="hover:text-blue-200">
                상품 목록
              </Link>

              <Link
                to="/cart"
                className="hover:text-blue-200 flex items-center"
              >
                장바구니
                {totalQuantity > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              <Link to="/order" className="hover:text-blue-200">
                주문하기
              </Link>

              {/* 관리자일 때만 관리자 메뉴 노출 */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-blue-200 text-yellow-300 font-bold"
                >
                  관리자
                </Link>
              )}

              {/* 간편 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="text-sm text-blue-200 hover:text-white border border-blue-400 px-2 py-1 rounded cursor-pointer transition"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
