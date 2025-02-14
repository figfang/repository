package com.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Member;

public interface MemberRepository extends JpaRepository<Member, Integer> {
	
	Member findByEmail(String email);
    boolean existsByEmail(String email);
}

