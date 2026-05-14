package com.market.backend.dto;

import java.util.List;

// 프론트엔드에서 수신받을 동기화 DTO
// 프런트엔드 장바구니 상태를 동기화할 때 사용하는 요청 DTO
public record CartSyncRequestDto(
        String userEmail,
        String userName,
        List<CartItemDto> items
) {
    public record CartItemDto(Long bookId, Integer quantity) {}
}