import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { supabase } from "../supabaseClient";

// App.jsx에서 session을 props로 받아옴
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
    <nav className="bg-white text-black rounded-b-4xl border-gray-400 p-6 shadow-lg relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* 좌측: 메인 메뉴 영역 */}
        <div className="space-x-2 md:space-x-6 flex items-center">
          {!session ? (
            <Link
              to="/"
              className="hover:text-blue-500 font-medium px-2 py-2 transition-colors"
            >
              로그인
            </Link>
          ) : (
            <>
              {/* 고객 정보 Dropdown */}
              <div className="relative group flex items-center h-full">
                <span className="cursor-pointer hover:text-blue-500 font-medium px-2 py-2 transition-colors">
                  고객 정보
                </span>
                {/* pt-2는 마우스 이동 시 메뉴가 닫히지 않게 하는 투명 브릿지 역할 */}
                <div className="absolute top-full left-0 pt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                    <Link
                      to="/profile"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                    >
                      내 정보
                    </Link>
                    <Link
                      to="/placeholder"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                    >
                      내 정보 수정
                    </Link>
                    <Link
                      to="/placeholder"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                    >
                      찜한 상품
                    </Link>
                    {/* 드롭다운 내부에도 로그아웃을 배치해 접근성을 높입니다 */}
                    <button
                      onClick={handleLogout}
                      className="text-left px-4 py-3 hover:bg-red-50 text-red-500 text-sm font-bold"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>

              {/* 상품 목록 Dropdown */}
              <div className="relative group flex items-center h-full">
                <span className="cursor-pointer hover:text-blue-500 font-medium px-2 py-2 transition-colors">
                  상품 목록
                </span>
                <div className="absolute top-full left-0 pt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                    <Link
                      to="/books"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                    >
                      전체 도서
                    </Link>
                    <Link
                      to="/placeholder"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b text-blue-600 font-bold"
                    >
                      베스트셀러
                    </Link>
                    <Link
                      to="/placeholder"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                    >
                      신간 도서
                    </Link>
                    <Link
                      to="/placeholder"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                    >
                      국내 도서
                    </Link>
                    <Link
                      to="/placeholder"
                      className="px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      해외 도서
                    </Link>
                  </div>
                </div>
              </div>

              {/* 장바구니 Dropdown */}
              <div className="relative group flex items-center h-full">
                <span className="cursor-pointer hover:text-blue-500 font-medium px-2 py-2 flex items-center transition-colors">
                  장바구니
                  {totalQuantity > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </span>
                <div className="absolute top-full left-0 pt-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                    <Link
                      to="/cart"
                      className="px-4 py-3 hover:bg-gray-100 text-sm flex justify-between items-center"
                    >
                      장바구니 가기
                      <span className="text-blue-600 font-bold">
                        {totalQuantity}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 주문하기 Dropdown */}
              <div className="relative group flex items-center h-full">
                <span className="cursor-pointer hover:text-blue-500 font-medium px-2 py-2 transition-colors">
                  주문하기
                </span>
                <div className="absolute top-full left-0 pt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                    <Link
                      to="/order"
                      className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                    >
                      주문/결제
                    </Link>
                    <Link
                      to="/placeholder"
                      className="px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      주문 내역 조회
                    </Link>
                  </div>
                </div>
              </div>

              {/* 관리자 Dropdown (관리자만 노출) */}
              {isAdmin && (
                <div className="relative group flex items-center h-full">
                  <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-bold px-2 py-2 transition-colors">
                    관리자
                  </span>
                  <div className="absolute top-full left-0 pt-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                      <Link
                        to="/admin"
                        className="px-4 py-3 hover:bg-gray-100 text-sm border-b"
                      >
                        신규 도서 등록
                      </Link>
                      <Link
                        to="/placeholder"
                        className="px-4 py-3 hover:bg-gray-100 text-sm"
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

        {/* 로그아웃 버튼 */}
        {session && (
          <div className="mx-2">
            <button
              onClick={handleLogout}
              className="text-sm bg-red-400 text-white hover:bg-red-300 hover:text-gray-800 px-3 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
