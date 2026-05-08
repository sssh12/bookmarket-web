import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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
          await axios.post("http://127.0.0.1:8080/api/cart/sync", {
            userEmail: session.user.email,
            userName:
              session.user.user_metadata?.name ||
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
      <div className="h-screen flex items-center justify-center">
        인증 정보 확인 중... ⏳
      </div>
    );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
              <Route path="/books" element={<BookList />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />

              {/* 아직 기능이 개발되지 않은 드롭다운 하위 메뉴들은 준비중 페이지로 연결 */}
              <Route path="/placeholder" element={<PlaceholderPage />} />
            </Route>

            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
