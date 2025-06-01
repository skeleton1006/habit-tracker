package com.example.helloapi;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HabitCheckinRepository extends JpaRepository<HabitCheckin, Long> {
    List<HabitCheckin> findByHabitId(Long habitId);
    List<HabitCheckin> findByHabitIdAndDateBetween(Long habitId, LocalDate startDate, LocalDate endDate);
    boolean existsByHabitIdAndDate(Long habitId, LocalDate date);
} 