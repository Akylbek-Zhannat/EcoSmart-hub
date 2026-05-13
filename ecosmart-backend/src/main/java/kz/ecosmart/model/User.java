package kz.ecosmart.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role;
    private String apartment;
    private Double budget;
    private Double tariff;
    private String currency;

    // ── JPA requires a public or protected no-arg constructor ─────────────────
    public User() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId()         { return id; }
    public String getName()     { return name; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public String getRole()     { return role; }
    public String getApartment(){ return apartment; }
    public Double getBudget()   { return budget; }
    public Double getTariff()   { return tariff; }
    public String getCurrency() { return currency; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id)              { this.id = id; }
    public void setName(String name)        { this.name = name; }
    public void setEmail(String email)      { this.email = email; }
    public void setPassword(String password){ this.password = password; }
    public void setRole(String role)        { this.role = role; }
    public void setApartment(String apt)    { this.apartment = apt; }
    public void setBudget(Double budget)    { this.budget = budget; }
    public void setTariff(Double tariff)    { this.tariff = tariff; }
    public void setCurrency(String currency){ this.currency = currency; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String email;
        private String password;
        private String role      = "HOME_OWNER";
        private String apartment;
        private Double budget    = 25000.0;
        private Double tariff    = 22.5;
        private String currency  = "₸";

        public Builder name(String name)            { this.name = name;           return this; }
        public Builder email(String email)          { this.email = email;         return this; }
        public Builder password(String password)    { this.password = password;   return this; }
        public Builder role(String role)            { this.role = role;           return this; }
        public Builder apartment(String apartment)  { this.apartment = apartment; return this; }
        public Builder budget(Double budget)        { this.budget = budget;       return this; }
        public Builder tariff(Double tariff)        { this.tariff = tariff;       return this; }
        public Builder currency(String currency)    { this.currency = currency;   return this; }

        public User build() {
            User u = new User();
            u.name      = this.name;
            u.email     = this.email;
            u.password  = this.password;
            u.role      = this.role;
            u.apartment = this.apartment;
            u.budget    = this.budget;
            u.tariff    = this.tariff;
            u.currency  = this.currency;
            return u;
        }
    }
}
