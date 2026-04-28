package com.market.backend.service;

import com.market.backend.domain.Order;
import com.market.backend.domain.OrderItem;
import com.market.backend.domain.User;
import com.market.backend.dto.OrderRequestDto;
import com.market.backend.repository.OrderRepository;
import com.market.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createOrder(OrderRequestDto dto) {
        
        // 1. 유저 조회 (Supabase Auth 연동 이슈로 DB에 없을 경우 자동 생성 로직 추가)
        User orderUser = null;
        if (dto.userEmail() != null && !dto.userEmail().isEmpty()) {
            orderUser = userRepository.findByEmail(dto.userEmail())
                    .orElseGet(() -> {
                        User newUser = User.builder()
                                .email(dto.userEmail())
                                .password("OAUTH_PROTECTED") // 소셜 로그인이므로 더미 패스워드
                                .name(dto.recipient())
                                .role(User.Role.USER)
                                .build();
                        return userRepository.save(newUser);
                    });
        }

        // 2. 주문 엔티티 생성 (User 매핑)
        Order order = Order.builder()
                .user(orderUser) // user_tb 연동 완수
                .recipient(dto.recipient())
                .phone(dto.phone())
                .address(dto.address())
                .totalPrice(dto.totalPrice())
                .build();

        // 3. 주문 상품(OrderItem) 변환 및 추가
        for (OrderRequestDto.OrderItemDto itemDto : dto.items()) {
            OrderItem orderItem = OrderItem.builder()
                    .bookId(itemDto.bookId())
                    .title(itemDto.title())
                    .quantity(itemDto.quantity())
                    .price(itemDto.price())
                    .build();
            order.addOrderItem(orderItem); // 연관관계 매핑
        }

        // 4. DB에 저장
        orderRepository.save(order);
    }
}