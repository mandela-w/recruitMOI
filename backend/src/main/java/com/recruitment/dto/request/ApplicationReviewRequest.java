package com.recruitment.dto.request;

import com.recruitment.enums.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationReviewRequest {
    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    @NotBlank(message = "Reason is required")
    private String reason;
}
