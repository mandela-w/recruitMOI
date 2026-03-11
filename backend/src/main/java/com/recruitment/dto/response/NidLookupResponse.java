package com.recruitment.dto.response;

import com.recruitment.enums.Gender;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class NidLookupResponse {
    private String nationalId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String nationality;
}
