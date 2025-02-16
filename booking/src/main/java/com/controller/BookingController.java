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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dto.BookingRequest;
import com.dto.BookingUpdateDTO;
import com.model.Booking;
import com.service.BookingService;

import jakarta.validation.Valid;

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
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.ok(booking);
    }


    // 取消訂位
    @DeleteMapping("/{bookingId}/")
    public ResponseEntity<Booking> cancelBooking(
    		@PathVariable Integer bookingId,
    		@RequestParam Integer memberId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, memberId));
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Booking>> getMemberBookings(@PathVariable Integer memberId) {
        List<Booking> bookings = bookingService.getMemberBookings(memberId);
        return ResponseEntity.ok(bookings);
    }
    //修改訂位
    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateBooking(
            @PathVariable Integer bookingId,
            @RequestBody @Valid BookingUpdateDTO dto) {
        Booking booking = bookingService.updateBooking(bookingId, dto);
        return ResponseEntity.ok(booking);
    }

}