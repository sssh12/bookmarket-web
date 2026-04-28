package com.market.backend.dto;

import java.util.List;

public record CartSyncRequestDto(
        String userEmail,
        String userName,
        List<CartItemDto> items
) {
    public record CartItemDto(Long bookId, Integer quantity) {}
}