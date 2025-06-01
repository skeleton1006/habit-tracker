package com.example.helloapi;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habits/{habitId}/checkins")
@CrossOrigin(origins = "http://localhost:5173")
public class HabitCheckinController {
    private final HabitCheckinRepository checkinRepository;
    private final HabitRepository habitRepository;

    public HabitCheckinController(HabitCheckinRepository checkinRepository, HabitRepository habitRepository) {
        this.checkinRepository = checkinRepository;
        this.habitRepository = habitRepository;
    }

    @PostMapping
    public ResponseEntity<?> checkIn(@PathVariable Long habitId, @RequestBody Map<String, String> request) {
        return habitRepository.findById(habitId)
            .map(habit -> {
                LocalDate date = LocalDate.parse(request.getOrDefault("date", LocalDate.now().toString()));
                
                if (checkinRepository.existsByHabitIdAndDate(habitId, date)) {
                    return ResponseEntity.badRequest().body("Already checked in for this date");
                }

                HabitCheckin checkin = new HabitCheckin();
                checkin.setHabit(habit);
                checkin.setDate(date);
                checkinRepository.save(checkin);
                
                return ResponseEntity.ok(checkin);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<HabitCheckin>> getCheckins(
            @PathVariable Long habitId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            return ResponseEntity.ok(
                checkinRepository.findByHabitIdAndDateBetween(habitId, start, end)
            );
        }
        
        return ResponseEntity.ok(checkinRepository.findByHabitId(habitId));
    }
} 