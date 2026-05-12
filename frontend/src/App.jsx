import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";
import { Toaster } from "sonner";

import Navbar from "./components/Navbar.jsx";
import BookList from "./pages/BookList.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import BestsellerPage from "./pages/BestsellerPage.jsx";
import NewBookPage from "./pages/NewBookPage.jsx";
import DomesticBookPage from "./pages/DomesticBookPage.jsx";
import ForeignBookPage from "./pages/ForeignBookPage.jsx";
import AdminBookListPage from "./pages/AdminBookListPage.jsx";
import AdminBookEditPage from "./pages/AdminBookEditPage.jsx";

function App() {
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

  if (authLoading) {
    return (
      <div className="p-10 text-center font-bold text-gray-500">
        앱 초기화 중... ⏳
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Toaster position="top-center" richColors />

        <Navbar session={session} />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
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
              <Route path="/placeholder" element={<PlaceholderPage />} />
            </Route>

            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/books" element={<AdminBookListPage />} />
              <Route
                path="/admin/books/edit/:id"
                element={<AdminBookEditPage />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
