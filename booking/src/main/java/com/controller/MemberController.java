package com.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/register")
    public String register(@RequestBody MemberDTO dto) {
        return memberService.register(dto);
    }

    @PutMapping("/update")
    public String updateMember(@RequestBody Member member) {
        return memberService.updateMember(member);
    }
    
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
        
        return ResponseEntity.ok(response);
    }
}