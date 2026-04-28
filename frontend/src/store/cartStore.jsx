import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // 1. 장바구니에 책 추가
      addToCart: (book) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.bookId === book.bookId,
        );

        if (existingItem) {
          // 이미 있는 책이면 수량(quantity)만 1 증가
          set({
            items: currentItems.map((item) =>
              item.bookId === book.bookId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          // 없는 책이면 수량 1로 새로 추가
          set({ items: [...currentItems, { ...book, quantity: 1 }] });
        }
      },

      // 2. 장바구니에서 특정 책 완전 삭제
      removeFromCart: (bookId) => {
        set({
          items: get().items.filter((item) => item.bookId !== bookId),
        });
      },

      // 3. 특정 책의 수량 증감 처리
      updateQuantity: (bookId, amount) => {
        const currentItems = get().items;
        set({
          items: currentItems.map((item) => {
            if (item.bookId === bookId) {
              const newQuantity = item.quantity + amount;
              // 수량은 최소 1이어야 함
              return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
          }),
        });
      },

      // 4. 장바구니 전체 비우기
      clearCart: () => set({ items: [] }),

      // 5. 총 결제 금액 계산 (선택적 편의 함수)
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "bookmarket-cart-storage", // 로컬 스토리지에 저장될 키 이름
    },
  ),
);
