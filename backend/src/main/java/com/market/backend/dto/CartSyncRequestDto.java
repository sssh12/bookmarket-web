package com.market.backend.dto;

import java.util.List;

// 프론트엔드에서 수신받을 동기화 DTO
public record CartSyncRequestDto(
        String userEmail,
        String userName,
        List<CartItemDto> items
) {
    public record CartItemDto(Long bookId, Integer quantity) {}
}