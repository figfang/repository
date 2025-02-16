package com.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.model.TimeSlot;
import com.service.TimeSlotService;

@RestController
@RequestMapping("/api/timeslot")
public class TimeSlotController {
    
    @Autowired
    private TimeSlotService timeSlotService;
    
    // 獲取所有時段列表
    @GetMapping("/list")
    public List<TimeSlot> findAll(){
    	return timeSlotService.findAll();
    }
    
    // 新增時段
    @PostMapping("/add")
    public ResponseEntity<TimeSlot> createTimeSlot(@RequestBody TimeSlot timeSlot) {
        TimeSlot created = timeSlotService.createTimeSlot(timeSlot);
        return ResponseEntity.ok(created);
    }
    
    // 刪除時段
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeSlot(@PathVariable("id") Integer timeSlotId) {
        timeSlotService.deleteTimeSlot(timeSlotId);
        return ResponseEntity.ok().build();
    }
    
   // 啟用/停用時段
    @PutMapping("/{id}/status")
    public ResponseEntity<TimeSlot> updateTimeSlotStatus(
            @PathVariable("id") Integer timeSlotId,
            @RequestParam Integer status) {
        TimeSlot updated = timeSlotService.updateTimeSlotStatus(timeSlotId, status);
        return ResponseEntity.ok(updated);
    }
    
   // 修改時段
    @PutMapping("/{id}")
    public ResponseEntity<TimeSlot> updateTimeSlot(
            @PathVariable("id") Integer timeSlotId,
            @RequestBody TimeSlot timeSlot) {
        TimeSlot updated = timeSlotService.updateTimeSlot(timeSlotId, timeSlot);
        return ResponseEntity.ok(updated);
    }
}
    
    

