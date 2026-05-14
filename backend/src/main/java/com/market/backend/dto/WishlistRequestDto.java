package com.market.backend.dto;

// 찜하기 또는 찜 해제를 요청할 때 사용하는 DTO
public record WishlistRequestDto(
        String userEmail,
        Long bookId
) {
}