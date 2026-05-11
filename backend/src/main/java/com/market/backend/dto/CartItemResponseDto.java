package com.market.backend.dto;

// 프론트엔드에 도서 정보까지 묶어서 내려주기 위한 응답 DTO
public record CartItemResponseDto(
        Long bookId,
        String title,
        Integer price,
        Integer quantity,
        String coverImageUrl,
        String isbn
) {
}