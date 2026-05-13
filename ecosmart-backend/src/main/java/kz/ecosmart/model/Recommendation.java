package kz.ecosmart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String emoji;
    private String priority;   // high | medium | low

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer saving;
    private String status;     // pending | accepted | ignored

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // ── JPA requires a public or protected no-arg constructor ─────────────────
    public Recommendation() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId()            { return id; }
    public String getEmoji()       { return emoji; }
    public String getPriority()    { return priority; }
    public String getTitle()       { return title; }
    public String getDescription() { return description; }
    public Integer getSaving()     { return saving; }
    public String getStatus()      { return status; }
    public User getUser()          { return user; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id)                      { this.id = id; }
    public void setEmoji(String emoji)              { this.emoji = emoji; }
    public void setPriority(String priority)        { this.priority = priority; }
    public void setTitle(String title)              { this.title = title; }
    public void setDescription(String description)  { this.description = description; }
    public void setSaving(Integer saving)           { this.saving = saving; }
    public void setStatus(String status)            { this.status = status; }
    public void setUser(User user)                  { this.user = user; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  emoji;
        private String  priority;
        private String  title;
        private String  description;
        private Integer saving;
        private String  status;
        private User    user;

        public Builder emoji(String emoji)              { this.emoji = emoji;           return this; }
        public Builder priority(String priority)        { this.priority = priority;     return this; }
        public Builder title(String title)              { this.title = title;           return this; }
        public Builder description(String description)  { this.description = description; return this; }
        public Builder saving(Integer saving)           { this.saving = saving;         return this; }
        public Builder status(String status)            { this.status = status;         return this; }
        public Builder user(User user)                  { this.user = user;             return this; }

        public Recommendation build() {
            Recommendation r = new Recommendation();
            r.emoji       = this.emoji;
            r.priority    = this.priority;
            r.title       = this.title;
            r.description = this.description;
            r.saving      = this.saving;
            r.status      = this.status;
            r.user        = this.user;
            return r;
        }
    }
}
