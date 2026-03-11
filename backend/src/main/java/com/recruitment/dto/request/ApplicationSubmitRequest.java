package com.recruitment.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationSubmitRequest {
    @NotBlank(message = "National ID is required")
    private String nationalId;

    @NotBlank(message = "Position applied is required")
    private String positionApplied;

    private String coverLetter;
    private String phone;
    private String address;
}
