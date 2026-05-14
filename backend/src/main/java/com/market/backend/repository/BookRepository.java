package com.market.backend.repository;

import com.market.backend.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// 도서 엔티티 조회와 사용자 정의 검색 쿼리를 제공하는 저장소
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * 전체 카테고리 기준 누적 판매량 상위 5권 조회
     */
    @Query(value = "SELECT b.* FROM book_tb b " +
                   "JOIN order_item_tb oi ON b.book_id = oi.book_id " +
                   "GROUP BY b.book_id " +
                   "ORDER BY SUM(oi.quantity) DESC " +
                   "LIMIT 5", nativeQuery = true)
    List<Book> findTop5BestsellersAll();

    /**
     * 특정 카테고리 기준 누적 판매량 상위 5권 조회
     * @param categoryId 조회할 카테고리 ID
     */
    @Query(value = "SELECT b.* FROM book_tb b " +
                   "JOIN order_item_tb oi ON b.book_id = oi.book_id " +
                   "WHERE b.category_id = :categoryId " +
                   "GROUP BY b.book_id " +
                   "ORDER BY SUM(oi.quantity) DESC " +
                   "LIMIT 5", nativeQuery = true)
    List<Book> findTop5BestsellersByCategoryId(@Param("categoryId") Long categoryId);
}