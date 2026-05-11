package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
// 수정: cart_id와 book_id에 유니크 제약 조건을 걸어 중복 삽입을 원천 차단합니다.
@Table(name = "cart_item_tb", uniqueConstraints = {
    @UniqueConstraint(name = "uk_cart_book", columnNames = {"cart_id", "bookId"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Cart cart;

    private Long bookId;
    private Integer quantity;

    // [리팩토링] 기존 아이템 업데이트를 위한 세터(Setter) 메서드 추가
    public void updateQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}