package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_tb")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
// 주문 전체 정보를 저장하는 엔티티
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    // [리팩토링] DB 물리 레벨에서 ON DELETE CASCADE 적용
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String phone;

    // [리팩토링] ERD 명칭(delivery_address) 매핑
    @Column(name = "delivery_address", nullable = false)
    private String address;

    @Column(nullable = false)
    private Integer totalPrice;

    // [리팩토링] ERD에 존재하는 주문 상태값 추가
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    // [리팩토링] ERD 명칭(order_date) 매핑 및 이름 변경
    @Column(name = "order_date", updatable = false)
    private LocalDateTime orderDate;

    @PrePersist
    protected void onCreate() {
        this.orderDate = LocalDateTime.now();
    }
    
    // 상태값 관리를 위한 Enum 추가
    public enum OrderStatus {
        PENDING, PAID, SHIPPING, DELIVERED, CANCELLED
    }

    public void addOrderItem(OrderItem orderItem) {
        items.add(orderItem);
        orderItem.setOrder(this);
    }
}