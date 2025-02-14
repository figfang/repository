package com.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.BookingRequest;
import com.dto.BookingUpdateDTO;
import com.model.Booking;
import com.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
	
    private final BookingService bookingService;
    
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

 // 新增訂位
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(
            request.getMemberId(),
            request.getTimeSlotId(),
            request.getBookingDate()
        );
        return ResponseEntity.ok(booking);
    }

    // 修改訂位
    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateBooking(
            @PathVariable Integer bookingId,
            @RequestBody BookingUpdateDTO updateDTO
            ){
    	Booking booking = bookingService.updateBooking(bookingId, updateDTO);
        return ResponseEntity.ok(booking);
    }

    // 取消訂位
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Integer bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    // 查詢訂位
    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBooking(@PathVariable Integer bookingId) {
        Booking booking = bookingService.getBooking(bookingId);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Booking>> getBookingsByMember(@PathVariable Integer memberId) {
        List<Booking> bookings = bookingService.getBookingByMember(memberId);
        
        if (bookings.isEmpty()) {
            return ResponseEntity.noContent().build(); // 如果沒有訂位，返回204
        }
        
        return ResponseEntity.ok(bookings);
    }
}