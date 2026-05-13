package kz.ecosmart.dto;

import java.util.List;
import java.util.Map;

// These DTOs are defined for reference; controllers currently use Map<String,Object> directly.

class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {}
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}

class RegisterRequest {
    private String name;
    private String email;
    private String password;

    public RegisterRequest() {}
    public String getName()     { return name; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public void setName(String name)         { this.name = name; }
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}

class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String avatar;

    public AuthResponse() {}
    public String getToken()  { return token; }
    public Long getUserId()   { return userId; }
    public String getName()   { return name; }
    public String getEmail()  { return email; }
    public String getRole()   { return role; }
    public String getAvatar() { return avatar; }
    public void setToken(String token)    { this.token = token; }
    public void setUserId(Long userId)    { this.userId = userId; }
    public void setName(String name)      { this.name = name; }
    public void setEmail(String email)    { this.email = email; }
    public void setRole(String role)      { this.role = role; }
    public void setAvatar(String avatar)  { this.avatar = avatar; }
}

class DashboardResponse {
    private Double currentKwh;
    private Double monthlyCost;
    private Double predictedSaving;
    private Integer activeDevices;
    private Double budgetUsed;
    private Double budgetTotal;
    private Integer co2Saved;
    private Integer efficiency;
    private List<Map<String, Object>> dailyEnergy;
    private List<Map<String, Object>> weeklyEnergy;

    public DashboardResponse() {}
    public Double getCurrentKwh()       { return currentKwh; }
    public Double getMonthlyCost()      { return monthlyCost; }
    public Double getPredictedSaving()  { return predictedSaving; }
    public Integer getActiveDevices()   { return activeDevices; }
    public Double getBudgetUsed()       { return budgetUsed; }
    public Double getBudgetTotal()      { return budgetTotal; }
    public Integer getCo2Saved()        { return co2Saved; }
    public Integer getEfficiency()      { return efficiency; }
    public List<Map<String,Object>> getDailyEnergy()  { return dailyEnergy; }
    public List<Map<String,Object>> getWeeklyEnergy() { return weeklyEnergy; }
}

class DeviceDto {
    private Long id;
    private String name;
    private String room;
    private String emoji;
    private String color;
    private Boolean status;
    private Integer powerWatts;
    private Double monthlyKwh;
    private Double monthlyCost;

    public DeviceDto() {}
    public Long getId()            { return id; }
    public String getName()        { return name; }
    public String getRoom()        { return room; }
    public String getEmoji()       { return emoji; }
    public String getColor()       { return color; }
    public Boolean getStatus()     { return status; }
    public Integer getPowerWatts() { return powerWatts; }
    public Double getMonthlyKwh()  { return monthlyKwh; }
    public Double getMonthlyCost() { return monthlyCost; }
}

class RecommendationDto {
    private Long id;
    private String emoji;
    private String priority;
    private String title;
    private String description;
    private Integer saving;
    private String status;

    public RecommendationDto() {}
    public Long getId()            { return id; }
    public String getEmoji()       { return emoji; }
    public String getPriority()    { return priority; }
    public String getTitle()       { return title; }
    public String getDescription() { return description; }
    public Integer getSaving()     { return saving; }
    public String getStatus()      { return status; }
}

class MonthlyReportResponse {
    private String month;
    private Double totalKwh;
    private Double totalCost;
    private Double prevCost;
    private Double saving;
    private Double savingPct;
    private Double budgetUsed;
    private Double budgetTotal;
    private Double avgDaily;
    private Integer co2Kg;
    private List<Map<String, Object>> topDevices;
    private List<String> recommendations;

    public MonthlyReportResponse() {}
    public String getMonth()        { return month; }
    public Double getTotalKwh()     { return totalKwh; }
    public Double getTotalCost()    { return totalCost; }
    public Double getPrevCost()     { return prevCost; }
    public Double getSaving()       { return saving; }
    public Double getSavingPct()    { return savingPct; }
    public Double getBudgetUsed()   { return budgetUsed; }
    public Double getBudgetTotal()  { return budgetTotal; }
    public Double getAvgDaily()     { return avgDaily; }
    public Integer getCo2Kg()       { return co2Kg; }
    public List<Map<String,Object>> getTopDevices()     { return topDevices; }
    public List<String> getRecommendations()            { return recommendations; }
}
