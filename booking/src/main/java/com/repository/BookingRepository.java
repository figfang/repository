package com.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
	
    List<Booking> findByMemberMemberIdAndBookingDate(Integer memberId, LocalDate bookingDate);
    List<Booking> findByMember_MemberId(Integer memberId);
    
    
}