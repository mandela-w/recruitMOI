package com.recruitment.dto.response;

import com.recruitment.enums.EducationLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EducationLevelStatsResponse {
    private EducationLevel educationLevel;
    private long count;
    private double percentage;
}
