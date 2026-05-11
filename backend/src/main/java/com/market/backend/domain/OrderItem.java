package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "order_item_tb")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    // [리팩토링] 주문 내역 삭제 시 주문 아이템도 DB 단에서 연쇄 삭제
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Order order;

    @Column(nullable = false)
    private Long bookId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer quantity;

    // [리팩토링] ERD 명칭(price_at_order) 매핑
    @Column(name = "price_at_order", nullable = false)
    private Integer price;

    public void setOrder(Order order) {
        this.order = order;
    }
}