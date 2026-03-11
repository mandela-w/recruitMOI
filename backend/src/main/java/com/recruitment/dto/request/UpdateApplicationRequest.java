package com.recruitment.dto.request;

import lombok.Data;

@Data
public class UpdateApplicationRequest {
    private String positionApplied;
    private String coverLetter;
    private String phone;
    private String address;
}
