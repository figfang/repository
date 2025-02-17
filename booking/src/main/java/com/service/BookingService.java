package com.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dto.BookingRequest;
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
	
	
	//檢查
	public boolean isTimeSlotAvailable(Integer timeSlotId, LocalDate bookingDate, Integer numberOfPeople) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new RuntimeException("未找到時段"));

        // 獲取該時段的所有確認訂位
        List<Booking> confirmedBookings = bookingRepository.findByTimeSlotAndBookingDateAndStatus(
                timeSlot, bookingDate, 0);

        // 計算已訂位的總人數
        int totalBookedPeople = confirmedBookings.stream()
                .mapToInt(Booking::getNumberOfPeople)
                .sum();

        // 檢查是否還有足夠容量
        return (totalBookedPeople + numberOfPeople) <= timeSlot.getMaxCapacity();
    }

    // 新增訂位
    public Booking createBooking(BookingRequest request) {
        // 取得會員資料以便發送簡訊
        Member member = memberRepository.findById(request.getMemberId())
            .orElseThrow(() -> new RuntimeException("會員不存在"));
        
        // 確認時段
        TimeSlot timeSlot = timeSlotRepository.findById(request.getTimeSlotId())
                .orElseThrow(() -> new RuntimeException("時段不存在"));
        
     // 檢查時段是否可用
        if (!isTimeSlotAvailable(request.getTimeSlotId(), request.getBookingDate(), request.getNumberOfPeople())) {
            throw new RuntimeException("時段已客滿");
        }
        
        //建立訂位
        Booking booking = new Booking();
        booking.setMember(member);
        booking.setTimeSlot(timeSlot);
        booking.setBookingDate(request.getBookingDate());
        booking.setNumberOfPeople(request.getNumberOfPeople());
        booking.setStatus(0);
        
        booking = bookingRepository.save(booking);
        
     // 發送訂位成功通知
        String message = String.format(
            "您的訂位已送出！用餐日期：%s，人數：%d人",
            booking.getBookingDate().toString(),
            booking.getNumberOfPeople()
        );
        smsService.sendSms(booking.getMember().getPhoneNumber(), message);

        return booking;
    }
    //取消
    public Booking cancelBooking(Integer bookingId, Integer memberId) {
        // 查找訂位
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("訂位不存在"));

        // 驗證訂位歸屬
        if (!booking.getMember().getMemberId().equals(memberId)) {
            throw new RuntimeException("這不是您的訂位");
        }

        // 檢查訂位狀態
        if (booking.getStatus() == 2) {
            throw new RuntimeException("訂位已經被取消");
        }

//        if (booking.getStatus() == 1) {
//            throw new RuntimeException("已確認的訂位無法取消");
//        }
        
        // 檢查是否為訂位當天
        LocalDate today = LocalDate.now();
        LocalDate bookingDate = booking.getBookingDate();

        if (today.equals(bookingDate)) {
            throw new RuntimeException("訂位當天無法取消訂位 如欲取消請與我們聯繫");
        }


        // 更新狀態為已取消
        booking.setStatus(2);
        booking = bookingRepository.save(booking);

        // 發送取消通知
        String message = String.format(
            "您的訂位已取消！原用餐日期：%s，人數：%d人",
            booking.getBookingDate().toString(),
            booking.getNumberOfPeople()
        );
        smsService.sendSms(booking.getMember().getPhoneNumber(), message);

        return booking;
    }
       
       public List<Booking> getMemberBookings(Integer memberId) {
           return bookingRepository.findByMemberMemberIdOrderByBookingDateDesc(memberId);
       }
       
       public Booking updateBooking(Integer bookingId, BookingUpdateDTO dto) {
           // 查找訂位
           Booking booking = bookingRepository.findById(bookingId)
                   .orElseThrow(() -> new RuntimeException("無法找到該訂位"));
           
        // 檢查是否為當天訂位
           LocalDate today = LocalDate.now();
           if (booking.getBookingDate().equals(today)) {
               throw new RuntimeException("當天訂位無法修改");
           }

//           // 驗證是否為待確認狀態
//           if (booking.getStatus() != 0) {
//               throw new RuntimeException("只能修改待確認狀態的訂位");
//           }

           // 如果要修改時段
           if (dto.getTimeSlotId() != null && !dto.getTimeSlotId().equals(booking.getTimeSlot().getTimeSlotId())) {
               TimeSlot newTimeSlot = timeSlotRepository.findById(dto.getTimeSlotId())
                       .orElseThrow(() -> new RuntimeException("無此時段"));

               // 檢查新時段可用性
               int checkPeople = dto.getNumberOfPeople() != null ? dto.getNumberOfPeople() : booking.getNumberOfPeople();
               if (!isTimeSlotAvailable(dto.getTimeSlotId(), booking.getBookingDate(), checkPeople)) {
                   throw new RuntimeException("所選時段已滿");
               }
               booking.setTimeSlot(newTimeSlot);
           }

           // 如果要修改人數
           if (dto.getNumberOfPeople() != null) {
               // 檢查目前時段的容量是否足夠
               if (!isTimeSlotAvailable(booking.getTimeSlot().getTimeSlotId(), 
                   booking.getBookingDate(), 
                   dto.getNumberOfPeople())) {
                   throw new RuntimeException("超過時段容量限制");
               }
               booking.setNumberOfPeople(dto.getNumberOfPeople());
           }

           booking = bookingRepository.save(booking);

           // 發送修改通知
           String message = String.format(
               "您的訂位已更新！新用餐日期：%s，最新人數：%d人，狀態：待確認",
               booking.getBookingDate().toString(),
               booking.getNumberOfPeople()
           );
           smsService.sendSms(booking.getMember().getPhoneNumber(), message);

           return booking;
       }
       
       
       
       //管理員
       public List<Booking> getAllBookings(Integer status, LocalDate startDate, LocalDate endDate) {
    	    List<Booking> bookings = bookingRepository.findAll();
    	    
    	    if (status != null) {
    	        bookings = bookings.stream()
    	                .filter(booking -> booking.getStatus().equals(status))
    	                .collect(Collectors.toList());
    	    }
    	    
    	    if (startDate != null) {
    	        bookings = bookings.stream()
    	                .filter(booking -> !booking.getBookingDate().isBefore(startDate))
    	                .collect(Collectors.toList());
    	    }
    	    
    	    if (endDate != null) {
    	        bookings = bookings.stream()
    	                .filter(booking -> !booking.getBookingDate().isAfter(endDate))
    	                .collect(Collectors.toList());
    	    }
    	    
    	    return bookings;
    	}

    	public Booking cancelBookingByAdmin(Integer bookingId) {
    	    Booking booking = bookingRepository.findById(bookingId)
    	            .orElseThrow(() -> new RuntimeException("訂位不存在"));

    	    if (booking.getStatus() == 2) {
    	        throw new RuntimeException("訂位已經被取消");
    	    }

    	    String message = String.format(
    	        "您的訂位已被取消！原訂位日期：%s，人數：%d人。如有任何疑問請與我們聯絡",
    	        booking.getBookingDate().toString(),
    	        booking.getNumberOfPeople()
    	    );
    	    smsService.sendSms(booking.getMember().getPhoneNumber(), message);

    	    bookingRepository.delete(booking);
    	    return booking;
    	}
    	
    	public Booking getBookingById(Integer bookingId) {
    	    return bookingRepository.findById(bookingId)
    	            .orElseThrow(() -> new RuntimeException("訂位不存在"));
    	}
   }

