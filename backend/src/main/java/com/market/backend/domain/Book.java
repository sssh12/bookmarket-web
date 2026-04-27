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
    private Long bookId; // book_id BIGINT

    @Column(nullable = false)
    private String title; // title VARCHAR(255)

    @Column(nullable = false)
    private String author; // author VARCHAR(255)

    private String publisher; // publisher VARCHAR(255)
    
    @Column(nullable = false)
    private Integer price; // price INT
    
    @Column(nullable = false)
    private Integer stock; // stock INT
    
    private String isbn; // isbn VARCHAR(20)
    
    @Column(columnDefinition = "TEXT")
    private String description; // description TEXT
    
    private String coverImageUrl; // cover_image_url VARCHAR(100)
    
    private LocalDateTime publishedAt; // published_at TIMESTAMP

    @Column(updatable = false)
    private LocalDateTime createdAt; // created_at TIMESTAMP

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}