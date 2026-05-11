import { create } from "zustand";
import { supabase } from "../supabaseClient.js";
import api from "../../api/axios.js";

// 장바구니 데이터를 상태로 관리하고 서버와 동기화하는 Zustand 스토어
export const useCartStore = create((set, get) => ({
  items: [],

  fetchCart: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      set({ items: [] });
      return;
    }

    try {
      const response = await api.get(`/api/carts?email=${session.user.email}`);
      set({ items: response.data || [] });
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
    }
  },

  syncCartToDB: async (newItems) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    try {
      await api.post("/api/carts/sync", {
        userEmail: session.user.email,
        userName: session.user.user_metadata?.full_name || "회원",
        items: newItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      });
    } catch (error) {
      console.error("장바구니 동기화 실패:", error);
      get().fetchCart(); // 에러 시 롤백
    }
  },

  addToCart: (book) => {
    const currentItems = get().items;
    const existingItem = currentItems.find(
      (item) => item.bookId === book.bookId,
    );

    let newItems;
    if (existingItem) {
      newItems = currentItems.map((item) =>
        item.bookId === book.bookId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      newItems = [...currentItems, { ...book, quantity: 1 }];
    }

    set({ items: newItems });
    get().syncCartToDB(newItems);
  },

  removeFromCart: (bookId) => {
    const newItems = get().items.filter((item) => item.bookId !== bookId);
    set({ items: newItems });
    get().syncCartToDB(newItems);
  },

  updateQuantity: (bookId, delta) => {
    const newItems = get().items.map((item) => {
      if (item.bookId === bookId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });

    set({ items: newItems });
    get().syncCartToDB(newItems);
  },

  clearCart: () => {
    set({ items: [] });
    get().syncCartToDB([]); // 이건 사용자가 "전체 비우기" 버튼을 누를 때만 사용
  },

  clearCartLocal: () => {
    set({ items: [] });
  },
}));
