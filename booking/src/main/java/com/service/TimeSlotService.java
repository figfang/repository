package com.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.model.TimeSlot;
import com.repository.TimeSlotRepository;

@Service
@Transactional
public class TimeSlotService {
    
    @Autowired
    private TimeSlotRepository timeSlotRepository;
    
    // 獲取所有時段
    public List<TimeSlot> findAll() {
        return timeSlotRepository.findAll();
    }
    
    //新增時段
    public TimeSlot createTimeSlot(TimeSlot timeSlot) {
        // 可以在這裡加入業務邏輯驗證
        // 例如: 檢查時間是否有重疊、容量是否合理等
        return timeSlotRepository.save(timeSlot);
    }
   // 刪除時段
    public void deleteTimeSlot(Integer timeSlotId) {
        timeSlotRepository.deleteById(timeSlotId);
    }
    
 // 修改時段
    public TimeSlot updateTimeSlot(Integer timeSlotId, TimeSlot updateTimeSlot) {
        Optional<TimeSlot> optionalTimeSlot = timeSlotRepository.findById(timeSlotId);
        if (optionalTimeSlot.isPresent()) {
            TimeSlot existingTimeSlot = optionalTimeSlot.get();
            // 更新欄位，但保留原始的 id 和 createdAt
            existingTimeSlot.setStartTime(updateTimeSlot.getStartTime());
            existingTimeSlot.setEndTime(updateTimeSlot.getEndTime());
            existingTimeSlot.setMaxCapacity(updateTimeSlot.getMaxCapacity());
            existingTimeSlot.setStatus(updateTimeSlot.getStatus());
            
            return timeSlotRepository.save(existingTimeSlot);
        }
        throw new RuntimeException("找不到指定的時段");
    }
    
   // 啟用/停用時段
    public TimeSlot updateTimeSlotStatus(Integer timeSlotId, Integer status) {
        Optional<TimeSlot> optionalTimeSlot = timeSlotRepository.findById(timeSlotId);
        if (optionalTimeSlot.isPresent()) {
            TimeSlot timeSlot = optionalTimeSlot.get();
            timeSlot.setStatus(status);
            return timeSlotRepository.save(timeSlot);
        }
        throw new RuntimeException("找不到指定的時段");
    }
}
   
        
        
        
