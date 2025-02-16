package com.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingUpdateDTO {
	
	private Integer timeSlotId;
    private LocalDate bookingDate;
    
    private TimeSlotDTO timeSlot;
    
    private Integer numberOfPeople;


    public Integer getTimeSlotId() {
        return timeSlotId;
    }

    public void setTimeSlotId(Integer timeSlotId) {
        this.timeSlotId = timeSlotId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }
}

