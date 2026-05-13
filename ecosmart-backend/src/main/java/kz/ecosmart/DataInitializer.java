package kz.ecosmart;

import kz.ecosmart.model.Device;
import kz.ecosmart.model.Recommendation;
import kz.ecosmart.model.User;
import kz.ecosmart.repository.DeviceRepository;
import kz.ecosmart.repository.RecommendationRepository;
import kz.ecosmart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository           userRepository;
    private final DeviceRepository         deviceRepository;
    private final RecommendationRepository recommendationRepository;

    public DataInitializer(UserRepository userRepository,
                           DeviceRepository deviceRepository,
                           RecommendationRepository recommendationRepository) {
        this.userRepository           = userRepository;
        this.deviceRepository         = deviceRepository;
        this.recommendationRepository = recommendationRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;   // already seeded

        // ── Demo user ────────────────────────────────────────────────────────
        User demo = userRepository.save(User.builder()
            .name("Demo User")
            .email("demo@ecosmart.kz")
            .password("demo1234")      // plain-text for MVP
            .role("USER")
            .budget(25000.0)
            .tariff(41.91)
            .currency("₸")
            .apartment("Astana, 2-room apartment")
            .build());

        // ── 8 demo devices ───────────────────────────────────────────────────
        deviceRepository.saveAll(List.of(

            Device.builder()
                .name("Smart Plug").room("Living Room").emoji("🔌").color("#34d399")
                .status(true).powerWatts(120).baseWatts(120)
                .monthlyKwh(19.4).monthlyCost(813.1).user(demo).build(),

            Device.builder()
                .name("Air Conditioner").room("Living Room").emoji("❄️").color("#60a5fa")
                .status(true).powerWatts(850).baseWatts(850)
                .monthlyKwh(98.4).monthlyCost(4121.7).user(demo).build(),

            Device.builder()
                .name("Washing Machine").room("Bathroom").emoji("🫧").color("#a78bfa")
                .status(false).powerWatts(0).baseWatts(2000)
                .monthlyKwh(42.1).monthlyCost(1763.9).user(demo).build(),

            Device.builder()
                .name("Refrigerator").room("Kitchen").emoji("🧊").color("#4ade80")
                .status(true).powerWatts(180).baseWatts(180)
                .monthlyKwh(38.8).monthlyCost(1625.9).user(demo).build(),

            Device.builder()
                .name("Heater").room("Bedroom").emoji("🔥").color("#f87171")
                .status(false).powerWatts(0).baseWatts(1500)
                .monthlyKwh(74.2).monthlyCost(3109.9).user(demo).build(),

            Device.builder()
                .name("Lighting").room("Hallway").emoji("💡").color("#fbbf24")
                .status(true).powerWatts(60).baseWatts(60)
                .monthlyKwh(28.6).monthlyCost(1198.6).user(demo).build(),

            Device.builder()
                .name("Electric Kettle").room("Kitchen").emoji("☕").color("#fb923c")
                .status(false).powerWatts(0).baseWatts(1800)
                .monthlyKwh(8.4).monthlyCost(352.0).user(demo).build(),

            Device.builder()
                .name("TV").room("Living Room").emoji("📺").color("#38bdf8")
                .status(true).powerWatts(95).baseWatts(95)
                .monthlyKwh(18.2).monthlyCost(762.8).user(demo).build()
        ));

        // ── 6 demo recommendations ───────────────────────────────────────────
        recommendationRepository.saveAll(List.of(

            Recommendation.builder()
                .emoji("⏰").priority("high")
                .title("Move washing machine usage to off-peak hours")
                .description("Your washing machine runs during peak tariff hours (18:00–22:00). " +
                             "Moving cycles to 23:00–06:00 will cut that device's cost nearly in half.")
                .saving(1260).status("pending").user(demo).build(),

            Recommendation.builder()
                .emoji("❄️").priority("high")
                .title("Air conditioner uses too much energy during peak tariff")
                .description("The AC ran for 6.4 hours during yesterday's peak period. " +
                             "Pre-cooling the apartment before 17:30 and reducing runtime by 2 h could save significantly.")
                .saving(890).status("pending").user(demo).build(),

            Recommendation.builder()
                .emoji("🔥").priority("medium")
                .title("Heater was active longer than usual")
                .description("Average heater usage this week was 5.8 h/day vs a baseline of 4.5 h/day. " +
                             "Check insulation or lower the thermostat by 1–2 °C for similar comfort.")
                .saving(420).status("accepted").user(demo).build(),

            Recommendation.builder()
                .emoji("🧊").priority("low")
                .title("Refrigerator consumption is stable")
                .description("Refrigerator usage is within normal range. " +
                             "Check the door seal periodically to keep compressor cycles optimal.")
                .saving(95).status("pending").user(demo).build(),

            Recommendation.builder()
                .emoji("💡").priority("low")
                .title("Lighting can be optimized in hallway")
                .description("Motion sensors detected no presence in the hallway for over 2 hours while the light stayed on. " +
                             "Enabling an auto-off rule would eliminate this standby waste.")
                .saving(180).status("pending").user(demo).build(),

            Recommendation.builder()
                .emoji("📊").priority("medium")
                .title("You can save approximately ₸3 500 this month")
                .description("Based on your current consumption trend you are on course to spend ₸7 800 " +
                             "vs last month's ₸11 040. Maintaining current habits secures this saving.")
                .saving(3500).status("pending").user(demo).build()
        ));
    }
}
