package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_tb")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    // 주문자 정보 매핑 (user_tb 활용)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Integer totalPrice;

    // 일대다(1:N) 관계: 하나의 주문은 여러 주문 상품을 가짐.
    // cascade = CascadeType.ALL을 통해 주문 저장 시 주문 상품도 함께 자동 저장
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // 연관관계 편의 메서드 (Order 저장 시 하위 Item들도 연결)
    public void addOrderItem(OrderItem orderItem) {
        this.items.add(orderItem);
        orderItem.setOrder(this);
    }
}
