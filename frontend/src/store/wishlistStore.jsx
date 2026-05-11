import { create } from "zustand";
import { supabase } from "../supabaseClient.js";
import api from "../../api/axios.js";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],

  // 백엔드 API에서 유저의 찜 목록 불러오기
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

  // 백엔드 API로 찜하기 토글 전송
  toggleWishlist: async (book) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    const userEmail = session.user.email;
    const currentList = get().wishlist;
    const isExist = currentList.find((item) => item.bookId === book.bookId);

    // 1. UI 즉시 반영
    if (isExist) {
      set({
        wishlist: currentList.filter((item) => item.bookId !== book.bookId),
      });
    } else {
      set({ wishlist: [...currentList, book] });
    }

    // 2. 백엔드 DB 연동
    try {
      await api.post("/api/wishlists/toggle", {
        userEmail: userEmail,
        bookId: book.bookId,
      });
    } catch (error) {
      console.error("찜하기 실패:", error);
      // 에러 발생 시 원래 상태로 롤백
      get().fetchWishlist();
    }
  },

  isInWishlist: (bookId) => {
    return get().wishlist.some((item) => item.bookId === bookId);
  },
}));
