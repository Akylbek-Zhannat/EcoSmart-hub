package kz.ecosmart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String room;
    private String emoji;
    private String color;
    private Boolean status;       // true = ON
    private Integer powerWatts;   // current draw in W
    private Integer baseWatts;    // nominal wattage when ON (restored after toggle)
    private Double monthlyKwh;
    private Double monthlyCost;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // ── JPA requires a public or protected no-arg constructor ─────────────────
    public Device() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId()            { return id; }
    public String getName()        { return name; }
    public String getRoom()        { return room; }
    public String getEmoji()       { return emoji; }
    public String getColor()       { return color; }
    public Boolean getStatus()     { return status; }
    public Integer getPowerWatts() { return powerWatts; }
    public Integer getBaseWatts()  { return baseWatts; }
    public Double getMonthlyKwh()  { return monthlyKwh; }
    public Double getMonthlyCost() { return monthlyCost; }
    public User getUser()          { return user; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id)                  { this.id = id; }
    public void setName(String name)            { this.name = name; }
    public void setRoom(String room)            { this.room = room; }
    public void setEmoji(String emoji)          { this.emoji = emoji; }
    public void setColor(String color)          { this.color = color; }
    public void setStatus(Boolean status)       { this.status = status; }
    public void setPowerWatts(Integer watts)    { this.powerWatts = watts; }
    public void setBaseWatts(Integer watts)     { this.baseWatts = watts; }
    public void setMonthlyKwh(Double kwh)       { this.monthlyKwh = kwh; }
    public void setMonthlyCost(Double cost)     { this.monthlyCost = cost; }
    public void setUser(User user)              { this.user = user; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  name;
        private String  room;
        private String  emoji;
        private String  color;
        private Boolean status;
        private Integer powerWatts;
        private Integer baseWatts;
        private Double  monthlyKwh;
        private Double  monthlyCost;
        private User    user;

        public Builder name(String name)            { this.name = name;             return this; }
        public Builder room(String room)            { this.room = room;             return this; }
        public Builder emoji(String emoji)          { this.emoji = emoji;           return this; }
        public Builder color(String color)          { this.color = color;           return this; }
        public Builder status(Boolean status)       { this.status = status;         return this; }
        public Builder powerWatts(Integer w)        { this.powerWatts = w;          return this; }
        public Builder baseWatts(Integer w)         { this.baseWatts = w;           return this; }
        public Builder monthlyKwh(Double kwh)       { this.monthlyKwh = kwh;        return this; }
        public Builder monthlyCost(Double cost)     { this.monthlyCost = cost;      return this; }
        public Builder user(User user)              { this.user = user;             return this; }

        public Device build() {
            Device d = new Device();
            d.name        = this.name;
            d.room        = this.room;
            d.emoji       = this.emoji;
            d.color       = this.color;
            d.status      = this.status;
            d.powerWatts  = this.powerWatts;
            d.baseWatts   = this.baseWatts;
            d.monthlyKwh  = this.monthlyKwh;
            d.monthlyCost = this.monthlyCost;
            d.user        = this.user;
            return d;
        }
    }
}
