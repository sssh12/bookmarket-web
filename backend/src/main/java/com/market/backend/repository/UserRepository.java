package com.market.backend.repository;

import com.market.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
// 사용자 엔티티를 조회하고 저장하는 저장소
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}