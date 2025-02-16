package com.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.model.Booking;
import com.model.Member;
import com.model.TimeSlot;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
	
	
	List<Booking> findByTimeSlotAndBookingDateAndStatus(
	        TimeSlot timeSlot, 
	        LocalDate bookingDate, 
	        Integer status
	    );
	
	@Query("SELECT DISTINCT b FROM Booking b " +
	           "LEFT JOIN FETCH b.member m " +
	           "LEFT JOIN FETCH b.timeSlot t " +
	           "WHERE b.member.memberId = :memberId " +
	           "ORDER BY b.bookingDate DESC")    
	    List<Booking> findByMemberMemberIdOrderByBookingDateDesc(Integer memberId);
	}
	
    
    
    