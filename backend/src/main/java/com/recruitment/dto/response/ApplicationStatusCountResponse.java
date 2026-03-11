package com.recruitment.dto.response;

import com.recruitment.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationStatusCountResponse {
    private ApplicationStatus status;
    private long count;
    private double percentage;
}
