package kz.ecosmart.controller;

import kz.ecosmart.repository.DeviceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DeviceRepository deviceRepository;

    public DashboardController(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {
        long activeDevices = deviceRepository.findAll().stream()
            .filter(d -> Boolean.TRUE.equals(d.getStatus())).count();

        return Map.of(
            "currentKwh",      312.4,
            "monthlyCost",     7029,
            "predictedSaving", 3240,
            "activeDevices",   activeDevices,
            "budgetUsed",      7029,
            "budgetTotal",     25000,
            "co2Saved",        142,
            "efficiency",      78,
            "dailyEnergy",     buildDailyData(),
            "weeklyEnergy",    buildWeeklyData()
        );
    }

    private List<Map<String, Object>> buildDailyData() {
        String[] hours = {"00","02","04","06","08","10","12","14","16","18","20","22"};
        double[] kwh   = {0.8, 0.5, 0.6, 1.4, 3.2, 2.8, 4.1, 3.9, 3.3, 5.2, 6.1, 2.4};
        double[] prev  = {1.1, 0.7, 0.8, 1.6, 3.8, 3.1, 4.6, 4.2, 3.9, 5.8, 6.4, 2.9};
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i < hours.length; i++) {
            list.add(Map.of("hour", hours[i], "kwh", kwh[i], "prev", prev[i]));
        }
        return list;
    }

    private List<Map<String, Object>> buildWeeklyData() {
        String[] days = {"Mon","Tue","Wed","Thu","Fri","Sat","Sun"};
        double[] kwh  = {18.4, 21.2, 17.8, 23.6, 25.1, 29.4, 26.8};
        int[]    cost = {414,  477,  401,  531,  565,  662,  603};
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i < days.length; i++) {
            list.add(Map.of("day", days[i], "kwh", kwh[i], "cost", cost[i]));
        }
        return list;
    }
}
