package com.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dto.BookingUpdateDTO;
import com.model.Booking;
import com.model.Member;
import com.model.TimeSlot;
import com.repository.BookingRepository;
import com.repository.MemberRepository;
import com.repository.TimeSlotRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class BookingService {
   
	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private TimeSlotRepository timeSlotRepository;

	
	@Autowired
	private SmsService smsService;
	

    // 新增訂位
    public Booking createBooking(Integer memberId, Integer timeSlotId, LocalDate bookingDate) {
        // 取得會員資料以便發送簡訊
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("會員不存在"));
        
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new RuntimeException("時段不存在"));

        Booking booking = new Booking();
        booking.setMember(member);
        booking.setTimeSlot(timeSlot);
        booking.setBookingDate(bookingDate);
        booking.setStatus(0);
        
        booking = bookingRepository.save(booking);
        
        // 發送通知簡訊
        smsService.sendSms(member.getPhoneNumber(), 
            String.format("您已完成預約，日期：%s", bookingDate));
        
        return booking;
    }

    // 修改訂位
    @Transactional
    public Booking updateBooking(Integer bookingId, BookingUpdateDTO updateDTO) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("訂位不存在"));
        
        
        
     // 根據 timeSlotId 查詢 TimeSlot 物件
        TimeSlot timeSlot = timeSlotRepository.findById(updateDTO.getTimeSlotId())
            .orElseThrow(() -> new RuntimeException("時段不存在"));
        
        
        booking.setTimeSlot(timeSlot);
        booking.setBookingDate(updateDTO.getBookingDate());
        
        booking = bookingRepository.save(booking);
        
        smsService.sendSms(booking.getMember().getPhoneNumber(), 
            String.format("您的預約已修改，新的日期：%s", 
            		booking.getBookingDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))));
        
        return booking;
    }

    // 取消訂位
    public void cancelBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("訂位不存在"));
        
        booking.setStatus(2);  // 已取消
        bookingRepository.save(booking);
        
        smsService.sendSms(booking.getMember().getPhoneNumber(), "您的預約已取消");
    }

    // 查詢訂位
    public Booking getBooking(Integer bookingId) {
        return bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("訂位不存在"));
    }
    
    public List<Booking> getBookingByMember(Integer memberId) {
        return bookingRepository.findByMember_MemberId(memberId);
    }
}