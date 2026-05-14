package com.market.backend.dto;

import java.util.List;

// 주문 생성 시 전달되는 요청 DTO
public record OrderRequestDto(
        String userEmail,
        String recipient,
        String phone,
        String address,
        Integer totalPrice,
        List<OrderItemDto> items
) {
    public record OrderItemDto(
            Long bookId,
            String title,
            Integer quantity,
            Integer price
    ) {}
}