package com.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dto.MemberDTO;
import com.model.Member;
import com.repository.MemberRepository;

@Service
public class MemberService {
	
    @Autowired
    private MemberRepository memberRepository;

    public String register(MemberDTO dto) {
        // 檢查email是否已存在
        if (memberRepository.existsByEmail(dto.getEmail())) {
            return "客戶已完成註冊";
        }

        // 創建新會員實體
        Member member = new Member();
        member.setEmail(dto.getEmail());
        member.setPassword(dto.getPassword());
        member.setName(dto.getName());
        member.setPhoneNumber(dto.getPhoneNumber());
        member.setCreateTime(LocalDateTime.now());

        // 儲存會員
        memberRepository.save(member);
        return "註冊成功";
    }

    public String updateMember(Member member) {
        if (!memberRepository.existsById(member.getMemberId())) {
            return "客戶不存在";
        }
        memberRepository.save(member);
        return "修改成功";
    }
}