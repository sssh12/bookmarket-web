package com.market.backend.dto;

import com.market.backend.domain.Book;
import com.market.backend.domain.Category;
import java.time.LocalDate;

public record BookRequestDto(
        String title,
        String author,
        String publisher,
        Integer price,
        // [리팩토링] stock 제거
        String isbn,
        String description,
        Integer categoryId,
        String origin, // [리팩토링] 프론트에서 보내는 origin 수신
        String coverImageUrl,
        LocalDate publishedAt 
) {
    public Book toEntity(Category category) {
        return Book.builder()
                .title(title)
                .author(author)
                .publisher(publisher)
                .price(price)
                .isbn(isbn)
                .description(description)
                .category(category)
                .origin(Book.Origin.valueOf(origin)) // String을 Enum으로 변환
                .coverImageUrl(coverImageUrl)
                .publishedAt(publishedAt != null ? publishedAt.atStartOfDay() : null)
                .build();
    }
}