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

        // 創建新會員
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
    
    //取得會員資料
    public Member getMember(Integer memberId) { 
    	return memberRepository.findById(memberId)
    			.orElseThrow(() -> new RuntimeException("會員不存在"));
    }
    
    //更新會員資料
    public String updateMember(Integer memberId, MemberDTO dto) {
        Member member = memberRepository.findById(memberId)
        		.orElseThrow(() -> new RuntimeException("會員不存在"));
        
        //檢查email是否已被其他會員使用
        if (!member.getEmail().equals(dto.getEmail())) {
        	if(memberRepository.existsByEmail(dto.getEmail())) {
        		return "此email已被使用";
        	}
        	member.setEmail(dto.getEmail());
        }
        
        member.setName(dto.getName());
        member.setPhoneNumber(dto.getPhoneNumber());
        memberRepository.save(member);
        return "更新成功";      		 
    }
    
    //更改密碼
    public String updatePassword(Integer memberId, String oldPassword, String newPassword) {
    	Member member = memberRepository.findById(memberId)
    			.orElseThrow(() -> new RuntimeException("會員不存在"));
    	
    	if(!member.getPassword().equals(oldPassword)) {
    		return "原密碼錯誤";
    	}
    	
    	member.setPassword(newPassword);
    	memberRepository.save(member);
    	return "密碼更新成功";
    }
    
    //刪除會員
    public String deleteMember(Integer memberId) {
    	Member member = memberRepository.findById(memberId)
    			.orElseThrow(() -> new RuntimeException("會員不存在"));
    	memberRepository.delete(member);
    	return "刪除成功";
    }
    
}