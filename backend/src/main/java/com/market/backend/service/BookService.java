package com.market.backend.service;

import com.market.backend.domain.Book;
import com.market.backend.domain.Category;
import com.market.backend.dto.BookRequestDto;
import com.market.backend.dto.BookResponseDto;
import com.market.backend.repository.BookRepository;
import com.market.backend.repository.CartItemRepository;
import com.market.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
// 도서 조회와 관리에 필요한 비즈니스 로직을 담당하는 서비스
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;

    public List<BookResponseDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(BookResponseDto::from)
                .collect(Collectors.toList());
    }

    public BookResponseDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 존재하지 않습니다."));
        return BookResponseDto.from(book);
    }

    // [추가] 실제 판매량(OrderItems) 기반 베스트셀러 Top 5 조회 (카테고리별 분기 처리)
    public List<BookResponseDto> getBestsellers(Long categoryId) {
        List<Book> bestBooks;
        
        // categoryId가 없거나 0이면 '전체' 베스트셀러 조회, 그 외엔 해당 카테고리의 베스트셀러 조회
        if (categoryId == null || categoryId == 0) {
            bestBooks = bookRepository.findTop5BestsellersAll();
        } else {
            bestBooks = bookRepository.findTop5BestsellersByCategoryId(categoryId);
        }

        return bestBooks.stream()
                .map(BookResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createBook(BookRequestDto requestDto) {
        Category category = null;
        if (requestDto.categoryId() != null) {
            category = categoryRepository.findById(requestDto.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 분야입니다."));
        }
        Book book = requestDto.toEntity(category);
        bookRepository.save(book);
    }

    @Transactional
    public void updateBook(Long id, BookRequestDto requestDto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 존재하지 않습니다."));

        Category category = null;
        if (requestDto.categoryId() != null) {
            category = categoryRepository.findById(requestDto.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 분야입니다."));
        }

        book.update(
                requestDto.title(),
                requestDto.author(),
                requestDto.publisher(),
                requestDto.price(),
                Book.Origin.valueOf(requestDto.origin()),
                requestDto.isbn(),
                requestDto.description(),
                category,
                requestDto.publishedAt() != null ? requestDto.publishedAt().atStartOfDay() : null,
                requestDto.coverImageUrl()
        );
    }

    // 도서 삭제 서비스 로직
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 존재하지 않습니다."));
        
        // 도서 삭제 직전에, 이 도서의 아이디를 참조하고 있는 장바구니 항목들 일괄 삭제
        cartItemRepository.deleteByBookId(id);
        
        // JpaRepository의 delete 메서드를 통해 도서 삭제 처리
        bookRepository.delete(book);
    }
}