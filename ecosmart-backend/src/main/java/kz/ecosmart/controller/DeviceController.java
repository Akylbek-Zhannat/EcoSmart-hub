package kz.ecosmart.controller;

import kz.ecosmart.model.Device;
import kz.ecosmart.repository.DeviceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleDevice(@PathVariable Long id) {
        return deviceRepository.findById(id).map(device -> {
            device.setStatus(!Boolean.TRUE.equals(device.getStatus()));
            int watts = device.getStatus() && device.getBaseWatts() != null ? device.getBaseWatts() : 0;
            device.setPowerWatts(watts);
            deviceRepository.save(device);
            return ResponseEntity.ok(Map.of(
                "id", device.getId(),
                "status", device.getStatus(),
                "message", device.getName() + " turned " + (device.getStatus() ? "ON" : "OFF")
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
