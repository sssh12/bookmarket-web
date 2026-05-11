package com.market.backend.repository;

import com.market.backend.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // 특정 도서 ID를 가진 장바구니 항목 삭제
    void deleteByBookId(Long bookId); 
}