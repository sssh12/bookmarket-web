package com.market.backend.repository;

import com.market.backend.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // 필요한 경우 추가적인 커스텀 메서드를 선언
}