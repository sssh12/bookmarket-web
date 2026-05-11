package com.market.backend.dto;

public record WishlistRequestDto(
        String userEmail,
        Long bookId
) {
}