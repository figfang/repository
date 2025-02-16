package com.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingRequest {
	
    @NotNull(message = "會員ID不能為空")
    private Integer memberId;

    @NotNull(message = "時段ID不能為空")
    private Integer timeSlotId;

    @NotNull(message = "預約日期不能為空")
    @Future(message = "預約日期必須是未來日期")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate bookingDate;
    
    @NotNull
    @Min(1)
    private Integer numberOfPeople;
}