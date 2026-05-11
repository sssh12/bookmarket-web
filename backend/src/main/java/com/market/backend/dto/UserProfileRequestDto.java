package com.market.backend.dto;

// 프론트엔드에서 내 정보 수정을 요청할 때 받을 DTO
public record UserProfileRequestDto(
        String name,
        String phoneNumber, // [수정] 변수명 통일
        String address
) {
}