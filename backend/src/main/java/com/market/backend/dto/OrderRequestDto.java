package com.market.backend.dto;

import java.util.List;

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