package kz.ecosmart.controller;

import kz.ecosmart.model.Recommendation;
import kz.ecosmart.repository.RecommendationRepository;
import kz.ecosmart.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

// ──────────────────────────────────────────────────────────────────────────────
// Energy Analytics  (data remains static demo values for MVP)
// ──────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/energy")
class EnergyController {

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("monthly",         buildMonthly());
        result.put("deviceBreakdown", buildDeviceBreakdown());
        result.put("peakHours",       buildPeakHours());
        result.put("dailyEnergy",     buildDailyEnergy());
        result.put("weeklyEnergy",    buildWeeklyEnergy());
        return result;
    }

    private List<Map<String, Object>> buildMonthly() {
        String[] months = {"Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"};
        int[]    kwh    = { 380,   412,   495,   520,   441,   398,   345,   312};
        int[]    cost   = {8550,  9270, 11138, 11700,  9923,  8955,  7763,  7020};
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", months[i]);
            m.put("kwh",   kwh[i]);
            m.put("cost",  cost[i]);
            if (i == months.length - 1) m.put("partial", true);
            list.add(m);
        }
        return list;
    }

    private List<Map<String, Object>> buildDeviceBreakdown() {
        return List.of(
            Map.of("name", "Air Conditioner", "kwh", 98.4, "pct", 31.5),
            Map.of("name", "Heater",          "kwh", 74.2, "pct", 23.8),
            Map.of("name", "Washing Machine", "kwh", 42.1, "pct", 13.5),
            Map.of("name", "Refrigerator",    "kwh", 38.8, "pct", 12.4),
            Map.of("name", "Lighting",        "kwh", 28.6, "pct",  9.2),
            Map.of("name", "Smart Plugs",     "kwh", 19.4, "pct",  6.2),
            Map.of("name", "Other",           "kwh", 10.9, "pct",  3.5)
        );
    }

    private List<Map<String, Object>> buildPeakHours() {
        return List.of(
            Map.of("hour", "06–08", "level", "medium"),
            Map.of("hour", "08–10", "level", "low"),
            Map.of("hour", "10–12", "level", "low"),
            Map.of("hour", "12–14", "level", "medium"),
            Map.of("hour", "14–16", "level", "low"),
            Map.of("hour", "16–18", "level", "medium"),
            Map.of("hour", "18–22", "level", "high"),
            Map.of("hour", "22–00", "level", "medium")
        );
    }

    private List<Map<String, Object>> buildDailyEnergy() {
        String[] hours = {"00","02","04","06","08","10","12","14","16","18","20","22"};
        double[] kwh   = {0.8, 0.5, 0.6, 1.4, 3.2, 2.8, 4.1, 3.9, 3.3, 5.2, 6.1, 2.4};
        double[] prev  = {1.1, 0.7, 0.8, 1.6, 3.8, 3.1, 4.6, 4.2, 3.9, 5.8, 6.4, 2.9};
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i < hours.length; i++) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("hour", hours[i]);
            m.put("kwh",  kwh[i]);
            m.put("prev", prev[i]);
            list.add(m);
        }
        return list;
    }

    private List<Map<String, Object>> buildWeeklyEnergy() {
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        double[] kwh  = {18.4,  21.2,  17.8,  23.6,  25.1,  29.4,  26.8};
        int[]    cost = { 414,   477,   401,   531,   565,   662,   603};
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i < days.length; i++) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("day",  days[i]);
            m.put("kwh",  kwh[i]);
            m.put("cost", cost[i]);
            list.add(m);
        }
        return list;
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Recommendations  (persisted in PostgreSQL)
// ──────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/recommendations")
class RecommendationController {

    private final RecommendationRepository recommendationRepository;

    RecommendationController(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getRecommendations() {
        return recommendationRepository.findAll().stream()
            .map(this::toMap)
            .collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        return recommendationRepository.findById(id)
            .map(r -> {
                r.setStatus(body.get("status"));
                recommendationRepository.save(r);
                return ResponseEntity.ok(toMap(r));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toMap(Recommendation r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",      r.getId());
        m.put("emoji",   r.getEmoji());
        m.put("priority", r.getPriority());
        m.put("title",   r.getTitle());
        m.put("desc",    r.getDescription());   // key matches frontend mockData field name
        m.put("saving",  r.getSaving());
        m.put("status",  r.getStatus());
        return m;
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Monthly Report  (static demo values for MVP)
// ──────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/reports")
class ReportController {

    @GetMapping("/monthly")
    public Map<String, Object> getMonthlyReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("month",       "May 2026");
        report.put("totalKwh",    312.4);
        report.put("totalCost",   7029);
        report.put("prevCost",    11040);
        report.put("saving",      4011);
        report.put("savingPct",   36.3);
        report.put("budgetUsed",  28.1);
        report.put("budgetTotal", 25000);
        report.put("avgDaily",    10.1);
        report.put("co2Kg",       142);
        report.put("topDevices", List.of(
            Map.of("name", "Air Conditioner", "kwh", 98.4, "cost", 2214, "pct", 31.5),
            Map.of("name", "Smart Heater",    "kwh", 74.2, "cost", 1670, "pct", 23.8),
            Map.of("name", "Washing Machine", "kwh", 42.1, "cost",  947, "pct", 13.5)
        ));
        report.put("recommendations", List.of(
            "Shift washing machine to off-peak hours → save ₸1 260",
            "Pre-cool apartment before peak tariff window → save ₸890",
            "Reduce heater runtime by 1.3 h/day → save ₸420"
        ));
        return report;
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Profile  (reads/writes real User from PostgreSQL)
// ──────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/profile")
class ProfileController {

    private final UserRepository userRepository;

    ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(u -> ResponseEntity.ok(toMap(u)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id,
                                            @RequestBody Map<String, Object> body) {
        return userRepository.findById(id)
            .map(u -> {
                if (body.containsKey("name"))      u.setName((String) body.get("name"));
                if (body.containsKey("email"))     u.setEmail((String) body.get("email"));
                if (body.containsKey("apartment")) u.setApartment((String) body.get("apartment"));
                if (body.containsKey("budget"))    u.setBudget(((Number) body.get("budget")).doubleValue());
                if (body.containsKey("tariff"))    u.setTariff(((Number) body.get("tariff")).doubleValue());
                if (body.containsKey("currency"))  u.setCurrency((String) body.get("currency"));
                userRepository.save(u);
                return ResponseEntity.ok(toMap(u));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toMap(kz.ecosmart.model.User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",        u.getId());
        m.put("name",      u.getName());
        m.put("email",     u.getEmail());
        m.put("apartment", u.getApartment());
        m.put("budget",    u.getBudget());
        m.put("tariff",    u.getTariff());
        m.put("currency",  u.getCurrency());
        m.put("notifications", Map.of("email", true, "push", true, "weekly", true, "monthly", true));
        return m;
    }
}
