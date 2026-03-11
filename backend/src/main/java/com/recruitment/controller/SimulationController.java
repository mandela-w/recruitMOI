package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.NesaLookupResponse;
import com.recruitment.dto.response.NidLookupResponse;
import com.recruitment.simulation.NesaSimulationService;
import com.recruitment.simulation.NidSimulationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/simulation")
@RequiredArgsConstructor
@Tag(name = "External API Simulation", description = "Simulated NID and NESA APIs for testing (public endpoints)")
public class SimulationController {

    private final NidSimulationService nidSimulationService;
    private final NesaSimulationService nesaSimulationService;

    @GetMapping("/nid/{nationalId}")
    @Operation(summary = "Simulate NID lookup - retrieves personal info by National ID")
    public ResponseEntity<ApiResponse<NidLookupResponse>> lookupNid(@PathVariable String nationalId) {
        NidLookupResponse response = nidSimulationService.lookupByNationalId(nationalId);
        return ResponseEntity.ok(ApiResponse.success("NID data retrieved successfully", response));
    }

    @GetMapping("/nesa/{nationalId}")
    @Operation(summary = "Simulate NESA lookup - retrieves academic info by National ID")
    public ResponseEntity<ApiResponse<NesaLookupResponse>> lookupNesa(@PathVariable String nationalId) {
        NesaLookupResponse response = nesaSimulationService.lookupByNationalId(nationalId);
        return ResponseEntity.ok(ApiResponse.success("NESA data retrieved successfully", response));
    }
}
