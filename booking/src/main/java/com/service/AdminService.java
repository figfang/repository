package com.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dto.AdminDTO;
import com.model.Admin;
import com.repository.AdminRepository;

@Service
public class AdminService {
	
	@Autowired
	private AdminRepository adminRepository;
	
	// 檢查email是否已存在
	public String register(AdminDTO adminDTO) {
        if (adminRepository.existsByEmail(adminDTO.getEmail())) {
            return "此email已註冊過";
        }
        
        //建立新管理員
        Admin admin = new Admin();
        admin.setEmail(adminDTO.getEmail());
        admin.setPassword(adminDTO.getPassword());
        admin.setName(adminDTO.getName());
        admin.setCreateTime(LocalDateTime.now());
        
        adminRepository.save(admin);
        return "註冊成功";
    }
	
	public Admin login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new RuntimeException("管理員不存在");
        }
            
        if (!admin.getPassword().equals(password)) {  //實際應用中應使用加密比對
            throw new RuntimeException("密碼錯誤");
        }
        
        return admin;
    }

	
	// 查詢所有管理員
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }
    
    // 根據ID查詢管理員
    public Admin findById(Integer id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到管理員"));
    }
    
    // 更新管理員資料
    public String updateAdmin(Integer id, AdminDTO adminDTO) {
        Admin admin = findById(id);
        
        // 檢查email是否已被其他管理員使用
        Admin existingAdmin = adminRepository.findByEmail(adminDTO.getEmail());
        if (existingAdmin != null && !existingAdmin.getAdminId().equals(id)) {
            return "此email已被使用";
        }
        
        admin.setEmail(adminDTO.getEmail());
        if (adminDTO.getPassword() != null && !adminDTO.getPassword().isEmpty()) {
            admin.setPassword(adminDTO.getPassword());
        }
        admin.setName(adminDTO.getName());
        adminRepository.save(admin);
        
        return "更新成功";
    }
    
    // 刪除管理員
    public String deleteAdmin(Integer id) {
        if (!adminRepository.existsById(id)) {
            return "找不到管理員";
        }
        adminRepository.deleteById(id);
        return "刪除成功";
    }
}
	
	

