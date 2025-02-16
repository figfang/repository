package com.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dto.AdminDTO;
import com.model.Admin;
import com.model.Booking;
import com.model.Member;
import com.repository.AdminRepository;
import com.repository.MemberRepository;
import com.service.AdminService;
import com.service.BookingService;
import com.service.MemberService;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
	
	@Autowired
	private AdminService adminService;
	
	@Autowired
	private MemberService memberService;
	
	@Autowired
	private BookingService bookingService;
	
	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private MemberRepository memberRepository;
	
	@PostMapping("/register")
	public String register(@RequestBody AdminDTO dto) {
		return adminService.register(dto);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AdminDTO dto) {
	    try {
	        Admin admin = adminService.login(dto.getEmail(), dto.getPassword());
	        return ResponseEntity.ok(admin);
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body(e.getMessage());
	    }
	}
	
	// 查詢所有管理員
    @GetMapping("/list")
    public List<Admin> findAll() {
        return adminService.findAll();
    }
    
    // 查詢單個管理員
    @GetMapping("/{id}")
    public Admin findById(@PathVariable Integer id) {
        return adminService.findById(id);
    }
    
    // 更新管理員資料
    @PutMapping("/{id}")
    public String updateAdmin(@PathVariable Integer id, @RequestBody AdminDTO dto) {
        return adminService.updateAdmin(id, dto);
    }
    
    // 刪除管理員
    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable Integer id) {
        return adminService.deleteAdmin(id);
    }
    
    //查看所有會員
    @GetMapping("/members/list")
    public List<Member> getAllMembers(){
    	return memberRepository.findAll();
    }
    
    //查詢特定會員
    @GetMapping("/members/{id}")
    public Member getMemberById(@PathVariable Integer id) {
    	return memberService.getMember(id);
    }
    
    //刪除會員
    @DeleteMapping("/members/{id}")
    public String deleteMember(@PathVariable Integer id) {
    	return memberService.deleteMember(id);
    }
    
    //查看所有訂位
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, startDate, endDate));
    }
    
    //查看單一訂位
    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Integer bookingId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId));
    }
    
   //取消特定訂位
    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Booking> cancelBookingByAdmin(@PathVariable Integer bookingId) {
        return ResponseEntity.ok(bookingService.cancelBookingByAdmin(bookingId));
    }
    
   
}
	
