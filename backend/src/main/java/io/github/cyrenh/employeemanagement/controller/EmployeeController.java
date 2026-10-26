package io.github.cyrenh.employeemanagement.controller;

import io.github.cyrenh.employeemanagement.dto.EmployeeRequest;
import io.github.cyrenh.employeemanagement.dto.EmployeeResponse;
import io.github.cyrenh.employeemanagement.dto.PhotoResponse;
import io.github.cyrenh.employeemanagement.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EmployeeResponse> create(
            @Valid @RequestPart("employee") EmployeeRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        EmployeeResponse created = service.create(request, photo);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getPhoto(@PathVariable UUID id) {
        PhotoResponse photo = service.getPhoto(id);
        return ResponseEntity.ok()
                // The type was detected from the file bytes at upload, never taken from the client
                .contentType(MediaType.parseMediaType(photo.contentType()))
                // Stops browsers from guessing a different, executable type
                .header("X-Content-Type-Options", "nosniff")
                // The browser revalidates, and the stored fingerprint lets the server answer 304 for unchanged photos
                .cacheControl(CacheControl.noCache())
                .eTag(photo.version())
                .body(photo.bytes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EmployeeResponse> update(
            @PathVariable UUID id,
            @Valid @RequestPart("employee") EmployeeRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "removePhoto", defaultValue = "false") boolean removePhoto) {
        return ResponseEntity.ok(service.update(id, request, photo, removePhoto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}