package com.recruitment.simulation;

import com.recruitment.dto.response.NidLookupResponse;
import com.recruitment.enums.Gender;
import com.recruitment.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;


@Service
public class NidSimulationService {

    private static final Map<String, NidLookupResponse> NID_DATABASE = new HashMap<>();

    static {

        // High School applicants

        NID_DATABASE.put("1199880012345678", NidLookupResponse.builder()
                .nationalId("1199880012345678")
                .firstName("Jean Claude")
                .lastName("Uwimana")
                .dateOfBirth(LocalDate.of(1998, 3, 15))
                .gender(Gender.MALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1200190098765432", NidLookupResponse.builder()
                .nationalId("1200190098765432")
                .firstName("Marie")
                .lastName("Mukamana")
                .dateOfBirth(LocalDate.of(2001, 7, 22))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1200290034561890", NidLookupResponse.builder()
                .nationalId("1200290034561890")
                .firstName("Amina")
                .lastName("Ingabire")
                .dateOfBirth(LocalDate.of(2002, 4, 18))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1199960078903456", NidLookupResponse.builder()
                .nationalId("1199960078903456")
                .firstName("Eric")
                .lastName("Niyonzima")
                .dateOfBirth(LocalDate.of(1996, 9, 30))
                .gender(Gender.MALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1200090011223344", NidLookupResponse.builder()
                .nationalId("1200090011223344")
                .firstName("Claudine")
                .lastName("Uwase")
                .dateOfBirth(LocalDate.of(2000, 1, 10))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());

        // Bachelor's degree holders

        NID_DATABASE.put("1199750056781234", NidLookupResponse.builder()
                .nationalId("1199750056781234")
                .firstName("Patrick")
                .lastName("Habimana")
                .dateOfBirth(LocalDate.of(1975, 11, 5))
                .gender(Gender.MALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1199850067891234", NidLookupResponse.builder()
                .nationalId("1199850067891234")
                .firstName("Diane")
                .lastName("Nyirahabimana")
                .dateOfBirth(LocalDate.of(1985, 6, 14))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1199920089012345", NidLookupResponse.builder()
                .nationalId("1199920089012345")
                .firstName("Thierry")
                .lastName("Mugisha")
                .dateOfBirth(LocalDate.of(1992, 2, 28))
                .gender(Gender.MALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1199780045671234", NidLookupResponse.builder()
                .nationalId("1199780045671234")
                .firstName("Solange")
                .lastName("Uwingabire")
                .dateOfBirth(LocalDate.of(1978, 8, 3))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1199930012340987", NidLookupResponse.builder()
                .nationalId("1199930012340987")
                .firstName("Olivier")
                .lastName("Nkurunziza")
                .dateOfBirth(LocalDate.of(1993, 12, 19))
                .gender(Gender.MALE)
                .nationality("Rwandan")
                .build());

        // Master's degree holders

        NID_DATABASE.put("1198960034562345", NidLookupResponse.builder()
                .nationalId("1198960034562345")
                .firstName("Gentille")
                .lastName("Umutoni")
                .dateOfBirth(LocalDate.of(1986, 5, 20))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1199050023451234", NidLookupResponse.builder()
                .nationalId("1199050023451234")
                .firstName("Alexis")
                .lastName("Tuyishime")
                .dateOfBirth(LocalDate.of(1990, 10, 7))
                .gender(Gender.MALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1199150078904567", NidLookupResponse.builder()
                .nationalId("1199150078904567")
                .firstName("Aline")
                .lastName("Mukamusoni")
                .dateOfBirth(LocalDate.of(1991, 3, 25))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());

        // Doctorate holders 

        NID_DATABASE.put("1198750056780001", NidLookupResponse.builder()
                .nationalId("1198750056780001")
                .firstName("Emmanuel")
                .lastName("Bizimana")
                .dateOfBirth(LocalDate.of(1975, 4, 12))
                .gender(Gender.MALE)
                .nationality("Rwandan")
                .build());

        NID_DATABASE.put("1198850045670002", NidLookupResponse.builder()
                .nationalId("1198850045670002")
                .firstName("Vestine")
                .lastName("Nyiransengimana")
                .dateOfBirth(LocalDate.of(1985, 9, 8))
                .gender(Gender.FEMALE)
                .nationality("Rwandan")
                .build());
    }

    public NidLookupResponse lookupByNationalId(String nationalId) {
        NidLookupResponse result = NID_DATABASE.get(nationalId);
        if (result == null) {
            throw new ResourceNotFoundException(
                    "No NID record found for ID: " + nationalId +
                    ". Please verify your National ID number."
            );
        }
        return result;
    }
}
