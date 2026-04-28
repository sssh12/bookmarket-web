import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const cartItems = useCartStore((state) => state.items);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Supabase 세션 감지
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

  // 2. 장바구니 내용(cartItems)이 바뀔 때마다 백엔드로 동기화 (DB 영속성 보장)
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
          console.log("장바구니 DB 동기화 완료");
        } catch (error) {
          console.error("장바구니 DB 동기화 실패:", error);
        }
      };
      syncToDB();
    }
  }, [cartItems, session]); // cartItems나 session이 바뀔 때 자동 실행

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
            <Route path="/" element={<AuthPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />
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
