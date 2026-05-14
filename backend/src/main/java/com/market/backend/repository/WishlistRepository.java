package com.market.backend.repository;

import com.market.backend.domain.Book;
import com.market.backend.domain.User;
import com.market.backend.domain.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
// 찜 목록 엔티티를 조회하고 저장하는 저장소
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    // 연관된 User 엔티티 내부의 email 필드를 기준으로 검색
    List<Wishlist> findByUser_Email(String email);
    
    // User와 Book 엔티티 객체를 전달받아 이미 찜한 내역이 있는지 확인
    Optional<Wishlist> findByUserAndBook(User user, Book book);
}