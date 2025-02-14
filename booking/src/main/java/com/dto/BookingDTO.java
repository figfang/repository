package com.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingDTO {
	
	 @NotNull(message = "會員ID不能為空")
	 private Integer memberId;
	 
	 @NotNull(message = "時段ID不能為空")
	 private Integer timeSlotId;
	 
	 @NotNull(message = "預約日期不能為空")
	 private LocalDate bookingDate;

}
