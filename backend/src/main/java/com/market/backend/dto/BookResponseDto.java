package com.market.backend.dto;

import com.market.backend.domain.Book;
import java.time.LocalDateTime;

// 화면에 도서를 표시하기 위한 응답 DTO
public record BookResponseDto(
        Long bookId,
        String title,
        String author,
        String publisher,
        Integer price,
        String isbn,
        String description,
        String coverImageUrl,
        // [리팩토링] 순서가 꼬이지 않게 명확히 배치
        String origin,       
        String categoryName, 
        LocalDateTime publishedAt
) {
    public static BookResponseDto from(Book book) {
        return new BookResponseDto(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getPrice(),
                book.getIsbn(),
                book.getDescription(),
                book.getCoverImageUrl(),
                // [리팩토링] record 선언 순서에 맞춰 정확하게 매핑
                book.getOrigin() != null ? book.getOrigin().name() : "미지정", 
                book.getCategory() != null ? book.getCategory().getCategoryName() : "분야 미지정",
                book.getPublishedAt()
        );
    }
}