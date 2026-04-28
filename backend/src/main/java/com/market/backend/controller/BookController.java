package com.market.backend.controller;

import com.market.backend.dto.BookResponseDto;
import com.market.backend.service.BookService;
import com.market.backend.dto.BookRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookResponseDto>> getAllBooks() {
        List<BookResponseDto> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDto> getBook(@PathVariable("id") Long id) {
        BookResponseDto book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

     @PostMapping
    public ResponseEntity<Void> createBook(@RequestBody BookRequestDto requestDto) {
        bookService.createBook(requestDto);
        return ResponseEntity.ok().build();
    }
}