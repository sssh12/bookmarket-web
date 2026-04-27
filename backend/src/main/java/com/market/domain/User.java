package com.market.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_tb")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // user_id BIGINT

    @Column(nullable = false)
    private String email; // email VARCHAR(45)

    @Column(nullable = false)
    private String password; // password VARCHAR(255) (암호화되어 저장될 예정)

    @Column(nullable = false)
    private String name; // name VARCHAR(50)

    private String phoneNumber; // phone_number VARCHAR(20)
    private String address; // address VARCHAR(255)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // role VARCHAR(20) (ADMIN or USER)

    @Column(updatable = false)
    private LocalDateTime createdAt; // created_at TIMESTAMP

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    public enum Role {
        USER, ADMIN
    }
}