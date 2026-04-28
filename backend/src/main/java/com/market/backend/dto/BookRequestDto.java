package com.market.backend.dto;

import com.market.backend.domain.Book;

public record BookRequestDto(
        String title,
        String author,
        String publisher,
        Integer price,
        Integer stock,
        String isbn,
        String description
) {
    // DTO를 DB 엔티티로 변환
    public Book toEntity() {
        return Book.builder()
                .title(title)
                .author(author)
                .publisher(publisher)
                .price(price)
                .stock(stock)
                .isbn(isbn)
                .description(description)
                .build();
    }
}