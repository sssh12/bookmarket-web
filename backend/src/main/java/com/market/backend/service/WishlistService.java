package com.market.backend.service;

import com.market.backend.domain.Book;
import com.market.backend.domain.User;
import com.market.backend.domain.Wishlist;
import com.market.backend.dto.BookResponseDto;
import com.market.backend.dto.WishlistRequestDto;
import com.market.backend.repository.BookRepository;
import com.market.backend.repository.UserRepository;
import com.market.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<BookResponseDto> getWishlist(String userEmail) {
        return wishlistRepository.findByUser_Email(userEmail).stream()
                .map(wishlist -> BookResponseDto.from(wishlist.getBook()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleWishlist(WishlistRequestDto dto) {
        // [버그 수정] 찜하기 시에도 백엔드 DB에 유저가 없으면 자동 생성하도록 방어 로직 추가
        User user = userRepository.findByEmail(dto.userEmail())
                .orElseGet(() -> {
                    try {
                        return userRepository.save(User.builder()
                                .email(dto.userEmail())
                                .password("OAUTH_PROTECTED")
                                .name(dto.userEmail().split("@")[0]) // 이메일 앞부분을 기본 이름으로 세팅
                                .role(User.Role.USER)
                                .build());
                    } catch (DataIntegrityViolationException e) {
                        return userRepository.findByEmail(dto.userEmail())
                                .orElseThrow(() -> new RuntimeException("회원 조회 실패"));
                    }
                });

        Book book = bookRepository.findById(dto.bookId())
                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));

        Optional<Wishlist> existing = wishlistRepository.findByUserAndBook(user, book);

        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get()); // 이미 찜했다면 삭제
        } else {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .book(book)
                    .build();
            wishlistRepository.save(wishlist); // 없다면 추가
        }
    }
}