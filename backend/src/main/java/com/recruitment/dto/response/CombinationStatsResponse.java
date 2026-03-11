package com.recruitment.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CombinationStatsResponse {
    private String combination;
    private long count;
    private double percentage;
}
