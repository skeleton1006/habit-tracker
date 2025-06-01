package com.example.helloapi;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "http://localhost:5173") // CORS対策（開発中のみ）
public class HabitController {
    private static final Logger logger = LoggerFactory.getLogger(HabitController.class);
    private final HabitRepository habitRepository;

    public HabitController(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    @GetMapping
    public List<Habit> getHabits() {
        return habitRepository.findAll();
    }

    @PostMapping
    public Habit addHabit(@RequestBody Habit habit) {
        return habitRepository.save(habit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHabit(@PathVariable Long id) {
        try {
            logger.info("Attempting to delete habit with ID: {}", id);
            
            if (!habitRepository.existsById(id)) {
                logger.warn("Habit with ID {} not found", id);
                return ResponseEntity.notFound().build();
            }
            
            habitRepository.deleteById(id);
            logger.info("Successfully deleted habit with ID: {}", id);
            return ResponseEntity.ok().body("Habit deleted successfully");
            
        } catch (Exception e) {
            logger.error("Error deleting habit with ID: {}", id, e);
            return ResponseEntity.internalServerError().body("Error deleting habit: " + e.getMessage());
        }
    }
}
