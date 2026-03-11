
export type Role = "APPLICANT" | "HR" | "SUPER_ADMIN";

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface NIDProfile {
  nid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  address: string;
  province: string;
  district: string;
  sector: string;
  phoneNumber: string;
}

export interface NESARecord {
  indexNumber: string;
  schoolName: string;
  combinationCode: string;
  combinationName: string;
  yearOfCompletion: number;
  grades: { subject: string; grade: string; points: number }[];
  totalPoints: number;
  division: string;
}

export interface Application {
  id: string;
  applicantId: string;
  applicant?: User;
  nid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  address: string;
  province: string;
  district: string;
  phoneNumber: string;
  email: string;
  nesaIndexNumber: string;
  schoolName: string;
  combinationName: string;
  yearOfCompletion: number;
  totalPoints: number;
  division: string;
  positionAppliedFor: string;
  coverLetter: string;
  cvFileName?: string;
  cvUrl?: string;
  status: ApplicationStatus;
  reviewedBy?: string;
  reviewerName?: string;
  reviewReason?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  underReview: number;
  submitted: number;
  totalUsers: number;
  activeUsers: number;
  totalHR: number;
  totalAdmins: number;
  totalApplicants: number;

  recentApplications: Application[];
  applicationsByStatus: { status: ApplicationStatus; count: number }[];
  applicationsByMonth: { month: string; count: number }[];
  applicationsByProvince: { province: string; count: number }[];

  topPositions: { position: string; count: number }[];
  ageGroups: { group: string; count: number }[];
  divisionBreakdown: { division: string; count: number }[];
  genderBreakdown: { gender: string; count: number }[];
  approvalRate: number;       // percentage 0-100
  avgPointsApproved: number;
  avgPointsRejected: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface LoginCredentials { email: string; password: string }

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApplicationFormData {
  nid: string;
  nesaIndexNumber: string;
  positionAppliedFor: string;
  coverLetter: string;
  cv?: File;
  email: string;
  phoneNumber: string;
}

export interface ReviewFormData {
  status: "APPROVED" | "REJECTED";
  reason: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserFilters {
  role?: Role;
  isActive?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}