package kz.ecosmart.config;

import kz.ecosmart.model.Device;
import kz.ecosmart.model.User;
import kz.ecosmart.repository.DeviceRepository;
import kz.ecosmart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(UserRepository users, DeviceRepository devices) {
        return args -> {
            if (users.existsByEmail("demo@ecosmart.kz")) return;

            User demo = users.save(User.builder()
                .name("Zhannat Akylbek")
                .email("demo@ecosmart.kz")
                .password("demo1234")
                .role("HOME_OWNER")
                .apartment("Almaty, Alatau District, Apt 47")
                .budget(25000.0)
                .tariff(22.5)
                .currency("₸")
                .build());

            List<Device> deviceList = List.of(
                Device.builder().name("Air Conditioner").room("Living Room").emoji("❄️")
                    .color("#60a5fa").status(true).powerWatts(1850).monthlyKwh(98.4).monthlyCost(2214.0).user(demo).build(),
                Device.builder().name("Smart Heater").room("Bedroom").emoji("🔥")
                    .color("#f87171").status(true).powerWatts(1200).monthlyKwh(74.2).monthlyCost(1670.0).user(demo).build(),
                Device.builder().name("Washing Machine").room("Bathroom").emoji("🫧")
                    .color("#a78bfa").status(false).powerWatts(0).monthlyKwh(42.1).monthlyCost(947.0).user(demo).build(),
                Device.builder().name("Refrigerator").room("Kitchen").emoji("🧊")
                    .color("#4ade80").status(true).powerWatts(140).monthlyKwh(38.8).monthlyCost(873.0).user(demo).build(),
                Device.builder().name("Smart Lighting").room("All Rooms").emoji("💡")
                    .color("#fbbf24").status(true).powerWatts(85).monthlyKwh(28.6).monthlyCost(644.0).user(demo).build(),
                Device.builder().name("Electric Kettle").room("Kitchen").emoji("☕")
                    .color("#fb923c").status(false).powerWatts(0).monthlyKwh(8.4).monthlyCost(189.0).user(demo).build(),
                Device.builder().name("TV + Media Box").room("Living Room").emoji("📺")
                    .color("#38bdf8").status(true).powerWatts(180).monthlyKwh(18.2).monthlyCost(410.0).user(demo).build(),
                Device.builder().name("Smart Plug Hub").room("Office").emoji("🔌")
                    .color("#34d399").status(true).powerWatts(240).monthlyKwh(19.4).monthlyCost(437.0).user(demo).build()
            );
            devices.saveAll(deviceList);

            System.out.println("✅ EcoSmart demo data seeded. Login: demo@ecosmart.kz / demo1234");
        };
    }
}
