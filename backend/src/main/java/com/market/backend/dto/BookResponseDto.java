package com.market.backend.dto;

import com.market.backend.domain.Book;
import java.time.LocalDateTime;

public record BookResponseDto(
        Long bookId,
        String title,
        String author,
        String publisher,
        Integer price,
        Integer stock,
        String isbn,
        String description,
        String coverImageUrl,
        LocalDateTime publishedAt
) {
    // Entity를 DTO로 변환하는 정적 팩토리 메서드
    public static BookResponseDto from(Book book) {
        return new BookResponseDto(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getPrice(),
                book.getStock(),
                book.getIsbn(),
                book.getDescription(),
                book.getCoverImageUrl(),
                book.getPublishedAt()
        );
    }
}