import { create } from "zustand";
import { supabase } from "../supabaseClient.js";
import api from "../../api/axios.js";
import { toast } from "sonner";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],

  fetchWishlist: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      set({ wishlist: [] });
      return;
    }

    try {
      const response = await api.get(
        `/api/wishlists?email=${session.user.email}`,
      );
      set({ wishlist: response.data });
    } catch (error) {
      console.error("찜 목록 불러오기 실패:", error);
    }
  },

  toggleWishlist: async (book) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error("로그인이 필요한 기능입니다.");
      return;
    }

    const userEmail = session.user.email;
    const currentList = get().wishlist;
    const isExist = currentList.find((item) => item.bookId === book.bookId);

    // 1. UI 즉시 반영 (Optimistic Update)
    if (isExist) {
      set({
        wishlist: currentList.filter((item) => item.bookId !== book.bookId),
      });
    } else {
      set({
        wishlist: [...currentList, book],
      });
    }

    // 2. 백엔드 연동
    try {
      await api.post("/api/wishlists/toggle", {
        userEmail,
        bookId: book.bookId,
      });
    } catch (error) {
      console.error("찜하기 통신 오류:", error);
    }
  },
}));
