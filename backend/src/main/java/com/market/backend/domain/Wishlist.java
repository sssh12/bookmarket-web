package com.market.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "wishlist_tb", uniqueConstraints = {
    // 한 유저가 같은 도서를 중복해서 찜하는 것을 방지하는 제약조건
    @UniqueConstraint(columnNames = {"user_id", "book_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wishlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    // [리팩토링] DB 물리 레벨에서 유저 삭제 시 찜 내역도 함께 연쇄 삭제되도록 적용
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    // [리팩토링] 도서가 삭제될 경우에도 해당 도서의 찜 내역이 연쇄 삭제되도록 적용
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Book book;
}