import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios"; // 멘토링 반영: 전역 axios 인스턴스 임포트
import { supabase } from "./supabaseClient";
import { useCartStore } from "./store/cartStore";

import Navbar from "./components/Navbar";
import BookList from "./pages/BookList";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaceholderPage from "./pages/PlaceholderPage";

// 새롭게 추가되는 하위 메뉴 페이지들 임포트
import ProfileEditPage from "./pages/ProfileEditPage";
import WishlistPage from "./pages/WishlistPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import BestsellerPage from "./pages/BestsellerPage";
import NewBookPage from "./pages/NewBookPage";
import DomesticBookPage from "./pages/DomesticBookPage";
import ForeignBookPage from "./pages/ForeignBookPage";
import AdminBookListPage from "./pages/AdminBookListPage";

function App() {
  const cartItems = useCartStore((state) => state.items);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      const syncToDB = async () => {
        try {
          // 멘토링 반영: baseURL이 설정된 api 객체를 사용하여 중복된 도메인 주소 제거
          await api.post("/api/cart/sync", {
            userEmail: session.user.email,
            userName:
              session.user.user_metadata?.full_name ||
              session.user.email.split("@")[0],
            items: cartItems.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
            })),
          });
        } catch (error) {
          console.error("장바구니 DB 동기화 실패:", error);
        }
      };
      syncToDB();
    }
  }, [cartItems, session]);

  if (authLoading)
    return (
      // 멘토링 반영: 토스(Toss) 톤앤매너를 반영한 화이트 톤의 깔끔한 로딩 UI
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">
          안전하게 인증 정보를 확인하고 있어요...
        </p>
      </div>
    );

  return (
    <Router>
      {/* 멘토링 반영: 전체 배경을 화이트 톤(또는 매우 밝은 회색)으로 변경하여 토스 느낌 부여 */}
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar session={session} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                session ? <Navigate to="/books" replace /> : <AuthPage />
              }
            />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile-edit" element={<ProfileEditPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/bestseller" element={<BestsellerPage />} />
              <Route path="/books/new" element={<NewBookPage />} />
              <Route path="/books/domestic" element={<DomesticBookPage />} />
              <Route path="/books/foreign" element={<ForeignBookPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />

              {/* 아직 기능이 개발되지 않은 드롭다운 하위 메뉴들은 준비중 페이지로 연결 */}
              <Route path="/placeholder" element={<PlaceholderPage />} />
            </Route>

            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/books" element={<AdminBookListPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
