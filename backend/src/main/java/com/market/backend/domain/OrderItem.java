package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;

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

    // 다대일(N:1) 관계: 여러 주문 상품이 하나의 주문에 속합니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private Long bookId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer price;

    // 양방향 연관관계를 위한 편의 메서드
    public void setOrder(Order order) {
        this.order = order;
    }
}