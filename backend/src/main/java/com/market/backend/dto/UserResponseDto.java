package com.market.backend.dto;

// 프론트엔드로 응답을 보낼 때 사용하는 DTO
public record UserResponseDto(
        String email,
        String name,
        String phoneNumber, // [수정] 변수명 통일
        String address
) {
}