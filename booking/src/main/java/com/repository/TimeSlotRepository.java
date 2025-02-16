package com.repository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.model.TimeSlot;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
	
//	// 查找重疊的時段
//    @Query("SELECT t FROM Timeslot t WHERE " +
//           "((t.startTime <= :endTime AND t.endTime >= :startTime) " +
//           "OR (t.startTime >= :startTime AND t.endTime <= :endTime) " +
//           "OR (t.startTime <= :startTime AND t.endTime >= :endTime)) " +
//           "AND t.timeslotId != :excludeId")
//    List<TimeSlot> findOverlappingTimeslots(
//            @Param("startTime") Time startTime,
//            @Param("endTime") Time endTime,
//            @Param("excludeId") Integer excludeId);
//    
//    // 查找指定時間範圍內的時段
//    @Query("SELECT t FROM Timeslot t WHERE t.startTime >= :startTime AND t.endTime <= :endTime")
//    List<TimeSlot> findByTimeRange(
//            @Param("startTime") Time startTime,
//            @Param("endTime") Time endTime);
//    
//    // 查找啟用的時段
//    List<TimeSlot> findByStatusTrue();
    
    //查詢所有
    List<TimeSlot> findAll();
}
   
