package com.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.MemberDTO;
import com.model.Member;
import com.repository.MemberRepository;
import com.service.MemberService;

@RestController
@RequestMapping("/api/member")
public class MemberController {
	
    @Autowired
    private MemberService memberService;
    
    @Autowired
    private MemberRepository memberRepository;

    //註冊
    @PostMapping("/register")
    public String register(@RequestBody MemberDTO dto) {
        return memberService.register(dto);
    }
    
    //登入
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody MemberDTO dto) {
        // 檢查 email 和密碼
        Member member = memberRepository.findByEmail(dto.getEmail());
        if (member == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "帳號不存在"));
        }
        
        if (!member.getPassword().equals(dto.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "密碼錯誤"));
        }
        
        // 登入成功，返回會員資訊
        Map<String, Object> response = new HashMap<>();
        response.put("message", "登入成功");
        response.put("memberId", member.getMemberId());
        response.put("name", member.getName());
        response.put("email", member.getEmail());
        response.put("phoneNumber", member.getPhoneNumber());
        
        System.out.println("登入成功: " + member.getMemberId()+
        		           ", 名:" + member.getName()+
        		           ", Email:" +member.getEmail());
        
        return ResponseEntity.ok(response);
        
        
    }
    
    //會員查看個人資料
    @GetMapping("/profile/{memberId}")
    public ResponseEntity<?> getProfile(@PathVariable Integer memberId){
    	try {
    		Member member = memberService.getMember(memberId);
    		Map<String, Object> response = new HashMap<>();
    		response.put("memberId", member.getMemberId());
    		response.put("name", member.getName());
    		response.put("email", member.getEmail());
            response.put("phoneNumber", member.getPhoneNumber());
            return ResponseEntity.ok(response);
    	} catch(RuntimeException e) {
    		return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    	}
    }
    
    //更新個人資料
    @PutMapping("/profile/{memberId}")
    public ResponseEntity<Map<String, String>> updateMember(
    		@PathVariable Integer memberId,
    		@RequestBody MemberDTO dto) {
    	String result = memberService.updateMember(memberId, dto);
    	if (result.equals("更新成功")) {
    		return ResponseEntity.ok(Map.of("message", result));
    	} else {
    		return ResponseEntity.badRequest().body(Map.of("message", result));
    	}
    }
    
    //更改密碼
    @PutMapping("/password/{memberId}")
    public ResponseEntity<Map<String, String>> updatePassword(
    		@PathVariable Integer memberId,
    		@RequestBody Map<String, String> passwordData){
    	String result = memberService.updatePassword(
    			memberId,
    			passwordData.get("oldPassword"),
    			passwordData.get("newPassword")
    	);
    	if (result.equals("密碼更新成功")) {
    		return ResponseEntity.ok(Map.of("message", result));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", result));
        }
    }
    		
    	}
    