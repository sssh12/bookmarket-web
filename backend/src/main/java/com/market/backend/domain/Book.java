package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_tb")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String publisher;
    
    @Column(nullable = false)
    private Integer price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Origin origin;
    
    private String isbn;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String coverImageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    private LocalDateTime publishedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Origin {
        DOMESTIC, FOREIGN
    }

    // [과제 5 반영] 도서 수정을 위한 비즈니스 로직 메서드 추가 (JPA Dirty Checking 활용)
    public void update(String title, String author, String publisher, Integer price, Origin origin, String isbn, String description, Category category, LocalDateTime publishedAt, String coverImageUrl) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.price = price;
        this.origin = origin;
        this.isbn = isbn;
        this.description = description;
        this.category = category;
        this.publishedAt = publishedAt;
        
        // 새로운 이미지가 업로드된 경우에만 이미지 URL 변경
        if (coverImageUrl != null && !coverImageUrl.isEmpty()) {
            this.coverImageUrl = coverImageUrl;
        }
    }
}