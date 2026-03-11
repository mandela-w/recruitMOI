import apiClient from "./client";
import type {
  Application,
  ApplicationFilters,
  PaginatedResponse,
  NIDProfile,
  NESARecord,
  ReviewFormData,
} from "@/types";
import { MOCK_APPLICATIONS } from "@/lib/mock/data";

const USE_MOCK = true;

const MOCK_NID_PROFILES: Record<string, NIDProfile> = {
  "1199880012345678": {
    nid: "1199880012345678",
    firstName: "Alice",
    lastName: "Uwimana",
    dateOfBirth: "1998-03-15",
    gender: "FEMALE",
    nationality: "Rwandan",
    address: "KG 123 Street, Kimihurura",
    province: "Kigali",
    district: "Gasabo",
    sector: "Kimihurura",
    phoneNumber: "+250781234567",
  },
  "1199780098765432": {
    nid: "1199780098765432",
    firstName: "Bruno",
    lastName: "Nzeyimana",
    dateOfBirth: "1997-07-22",
    gender: "MALE",
    nationality: "Rwandan",
    address: "KN 45 Avenue, Nyamirambo",
    province: "Kigali",
    district: "Nyarugenge",
    sector: "Nyamirambo",
    phoneNumber: "+250788765432",
  },
  "1200080045678901": {
    nid: "1200080045678901",
    firstName: "Claudine",
    lastName: "Ingabire",
    dateOfBirth: "2000-11-05",
    gender: "FEMALE",
    nationality: "Rwandan",
    address: "Huye Main Road",
    province: "Southern",
    district: "Huye",
    sector: "Ngoma",
    phoneNumber: "+250792345678",
  },
};

const MOCK_NESA_RECORDS: Record<string, NESARecord> = {
  "G054-059-003-2018": {
    indexNumber: "G054-059-003-2018",
    schoolName: "Lycée de Kigali",
    combinationCode: "MPC",
    combinationName: "Mathematics-Physics-Computer Science",
    yearOfCompletion: 2018,
    totalPoints: 53,
    division: "Division I",
    grades: [
      { subject: "Mathematics", grade: "A", points: 20 },
      { subject: "Physics", grade: "A", points: 18 },
      { subject: "Computer Science", grade: "A", points: 15 },
    ],
  },
  "G021-033-007-2017": {
    indexNumber: "G021-033-007-2017",
    schoolName: "Groupe Scolaire Officiel de Butare",
    combinationCode: "BCB",
    combinationName: "Biology-Chemistry-Physics",
    yearOfCompletion: 2017,
    totalPoints: 48,
    division: "Division I",
    grades: [
      { subject: "Biology", grade: "A", points: 17 },
      { subject: "Chemistry", grade: "B", points: 16 },
      { subject: "Physics", grade: "A", points: 15 },
    ],
  },
  "S012-044-009-2020": {
    indexNumber: "S012-044-009-2020",
    schoolName: "École Secondaire de Nyanza",
    combinationCode: "AEG",
    combinationName: "Accounting-Economics-Mathematics",
    yearOfCompletion: 2020,
    totalPoints: 44,
    division: "Division II",
    grades: [
      { subject: "Accounting", grade: "B", points: 16 },
      { subject: "Economics", grade: "B", points: 15 },
      { subject: "Mathematics", grade: "B", points: 13 },
    ],
  },
};

function buildGenericNIDProfile(nid: string): NIDProfile {
  return {
    nid,
    firstName: "Jean",
    lastName: "Mutabazi",
    dateOfBirth: "1999-06-12",
    gender: "MALE",
    nationality: "Rwandan",
    address: "KG 201 Street, Kicukiro",
    province: "Kigali",
    district: "Kicukiro",
    sector: "Niboye",
    phoneNumber: "+250780000000",
  };
}

function buildGenericNESARecord(indexNumber: string): NESARecord {
  return {
    indexNumber,
    schoolName: "Groupe Scolaire Officiel de Kigali",
    combinationCode: "MCB",
    combinationName: "Mathematics-Chemistry-Biology",
    yearOfCompletion: 2020,
    totalPoints: 50,
    division: "Division I",
    grades: [
      { subject: "Mathematics", grade: "A", points: 18 },
      { subject: "Chemistry", grade: "B", points: 16 },
      { subject: "Biology", grade: "A", points: 16 },
    ],
  };
}

const ALICE_APPLICATIONS: Record<string, Application> = {
  UNDER_REVIEW: {
    ...MOCK_APPLICATIONS[0],
    status: "UNDER_REVIEW",
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
  },
  APPROVED: {
    ...MOCK_APPLICATIONS[0],
    status: "APPROVED",
    reviewerName: "Jean Habimana",
    reviewReason:
      "Excellent academic background with Division I results and strong technical skills. Your cover letter demonstrated clear passion for the role. We are pleased to invite you for the next stage.",
    reviewedAt: "2024-01-20T10:30:00Z",
  },
  REJECTED: {
    ...MOCK_APPLICATIONS[0],
    status: "REJECTED",
    reviewerName: "Jean Habimana",
    reviewReason:
      "While your academic profile is strong, we have selected a candidate whose experience more closely matches our current requirements. We encourage you to apply for future openings.",
    reviewedAt: "2024-01-20T10:30:00Z",
  },
};

const DEMO_STATUS_KEY = "demo_app_status";

export function getDemoStatus(): string {
  if (typeof window === "undefined") return "UNDER_REVIEW";
  return sessionStorage.getItem(DEMO_STATUS_KEY) || "UNDER_REVIEW";
}

export function setDemoStatus(status: string): void {
  if (typeof window !== "undefined")
    sessionStorage.setItem(DEMO_STATUS_KEY, status);
}

export const applicationRepository = {
  async create(formData: FormData): Promise<Application> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800));
      return {
        ...MOCK_APPLICATIONS[0],
        id: `app-${Date.now()}`,
        status: "SUBMITTED",
        reviewerName: undefined,
        reviewReason: undefined,
        reviewedAt: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const { data } = await apiClient.post<Application>(
      "/applications",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },

  async getMyApplication(): Promise<Application> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const status = getDemoStatus();
      return ALICE_APPLICATIONS[status] ?? ALICE_APPLICATIONS["UNDER_REVIEW"];
    }
    const { data } = await apiClient.get<Application>("/applications/my");
    return data;
  },

  async getLatest(
    filters?: ApplicationFilters,
  ): Promise<PaginatedResponse<Application>> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      let list = [...MOCK_APPLICATIONS];

      if (filters?.status)
        list = list.filter((a) => a.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (a) =>
            a.firstName.toLowerCase().includes(q) ||
            a.lastName.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.positionAppliedFor.toLowerCase().includes(q),
        );
      }

      const dir = filters?.sortOrder === "desc" ? -1 : 1;
      list.sort((a, b) => dir * a.lastName.localeCompare(b.lastName));

      const pageSize = filters?.pageSize ?? 10;
      const page = filters?.page ?? 1;
      const sliced = list.slice((page - 1) * pageSize, page * pageSize);
      return {
        data: sliced,
        total: list.length,
        page,
        pageSize,
        totalPages: Math.ceil(list.length / pageSize),
      };
    }
    const { data } = await apiClient.get<PaginatedResponse<Application>>(
      "/applications",
      {
        params: filters,
      },
    );
    return data;
  },

  async getById(id: string): Promise<Application> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const found = MOCK_APPLICATIONS.find((a) => a.id === id);
      if (!found) throw { message: "Application not found" };
      return found;
    }
    const { data } = await apiClient.get<Application>(`/applications/${id}`);
    return data;
  },

  async review(id: string, reviewData: ReviewFormData): Promise<Application> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const found = MOCK_APPLICATIONS.find((a) => a.id === id);
      if (!found) throw { message: "Application not found" };
      return {
        ...found,
        status: reviewData.status,
        reviewReason: reviewData.reason,
        reviewerName: "Jean Habimana",
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const { data } = await apiClient.patch<Application>(
      `/applications/${id}/review`,
      reviewData,
    );
    return data;
  },

  async getAll(
    filters?: ApplicationFilters,
  ): Promise<PaginatedResponse<Application>> {
    return applicationRepository.getLatest(filters);
  },
};

export const nidRepository = {
  async verify(nid: string): Promise<NIDProfile> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
      return MOCK_NID_PROFILES[nid] ?? buildGenericNIDProfile(nid);
    }
    const { data } = await apiClient.post<NIDProfile>("/external/nid/verify", {
      nid,
    });
    return data;
  },
};

export const nesaRepository = {
  async verify(indexNumber: string): Promise<NESARecord> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
      return (
        MOCK_NESA_RECORDS[indexNumber] ?? buildGenericNESARecord(indexNumber)
      );
    }
    const { data } = await apiClient.post<NESARecord>("/external/nesa/verify", {
      indexNumber,
    });
    return data;
  },
};
