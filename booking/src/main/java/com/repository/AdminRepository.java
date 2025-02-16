package com.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
	
	Admin findByEmail(String email);
    boolean existsByEmail(String email);
}
    
