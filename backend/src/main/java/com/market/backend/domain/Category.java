package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
// 도서 분류 정보를 저장하는 엔티티
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @Column(name = "category_name", nullable = false, length = 50)
    private String categoryName;
}