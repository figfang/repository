package com.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.model.Booking;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
	
	
    private Integer bookingId;
    private Integer memberId;
    private Integer timeSlotId;
    private LocalDate bookingDate;
    private Integer status;
    private LocalDateTime createTime;

    public static BookingResponse from(Booking booking) {
        return BookingResponse.builder()
            .bookingId(booking.getBookingId())
            .memberId(booking.getMember().getMemberId())
            .timeSlotId(booking.getTimeSlot().getTimeSlotId())
            .bookingDate(booking.getBookingDate())
            .status(booking.getStatus())
            .createTime(booking.getCreateTime())
            .build();
    }
}