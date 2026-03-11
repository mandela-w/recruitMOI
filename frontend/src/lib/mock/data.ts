import type { User } from "@/types";

// ── Mock users ────────────────────────────────────────────────
export const MOCK_USERS: Record<string, { user: User; password: string }> = {
  "applicant@demo.com": {
    password: "Demo@1234",
    user: {
      id: "mock-001",
      email: "applicant@demo.com",
      firstName: "Alice",
      lastName: "Uwimana",
      role: "APPLICANT",
      isActive: true,
      createdAt: "2024-01-10T08:00:00Z",
      updatedAt: "2024-01-10T08:00:00Z",
      lastLoginAt: new Date().toISOString(),
    },
  },
  "hr@demo.com": {
    password: "Demo@1234",
    user: {
      id: "mock-002",
      email: "hr@demo.com",
      firstName: "Jean",
      lastName: "Habimana",
      role: "HR",
      isActive: true,
      createdAt: "2024-01-05T08:00:00Z",
      updatedAt: "2024-01-05T08:00:00Z",
      lastLoginAt: new Date().toISOString(),
    },
  },
  "admin@demo.com": {
    password: "Demo@1234",
    user: {
      id: "mock-003",
      email: "admin@demo.com",
      firstName: "Marie",
      lastName: "Mukamana",
      role: "SUPER_ADMIN",
      isActive: true,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z",
      lastLoginAt: new Date().toISOString(),
    },
  },
};

export const MOCK_TOKEN = "mock-jwt-token-dev-only";
export const MOCK_REFRESH_TOKEN = "mock-refresh-token-dev-only";

/// ── Mock dashboard stats ──────────────────────────────────────
export const MOCK_DASHBOARD_STATS = {
  // Headline counters
  totalApplications: 12,
  submitted: 5,
  underReview: 2,
  approved: 3,
  rejected: 2,
  pendingReview: 7, // submitted + underReview
  totalUsers: 15,
  activeUsers: 12,
  totalHR: 2,
  totalAdmins: 1,
  totalApplicants: 12,

  recentApplications: [],

  // Status breakdown
  applicationsByStatus: [
    { status: "SUBMITTED" as const, count: 5 },
    { status: "UNDER_REVIEW" as const, count: 2 },
    { status: "APPROVED" as const, count: 3 },
    { status: "REJECTED" as const, count: 2 },
  ],

  // Monthly trend
  applicationsByMonth: [
    { month: "Aug", count: 1 },
    { month: "Sep", count: 2 },
    { month: "Oct", count: 3 },
    { month: "Nov", count: 2 },
    { month: "Dec", count: 1 },
    { month: "Jan", count: 3 },
  ],

  // Province distribution
  applicationsByProvince: [
    { province: "Kigali", count: 5 },
    { province: "Northern", count: 2 },
    { province: "Southern", count: 2 },
    { province: "Eastern", count: 2 },
    { province: "Western", count: 1 },
  ],

  // Top positions applied for
  topPositions: [
    { position: "Software Engineer", count: 2 },
    { position: "Junior Developer", count: 1 },
    { position: "Data Analyst", count: 1 },
    { position: "Finance Officer", count: 1 },
    { position: "Project Coordinator", count: 1 },
    { position: "Network Engineer", count: 1 },
    { position: "Systems Administrator", count: 1 },
    { position: "Public Health Officer", count: 1 },
    { position: "Business Analyst", count: 1 },
    { position: "Communications Officer", count: 1 },
    { position: "Administrative Asst.", count: 1 },
    { position: "IT Support Specialist", count: 1 },
  ],

  // Applicant age groups (derived from mock DOBs: 1997-2001)
  ageGroups: [
    { group: "18-20", count: 2 },
    { group: "21-23", count: 5 },
    { group: "24-26", count: 4 },
    { group: "27-30", count: 1 },
  ],

  // Academic division breakdown
  divisionBreakdown: [
    { division: "Division I", count: 10 },
    { division: "Division II", count: 2 },
  ],

  // Gender breakdown
  genderBreakdown: [
    { gender: "Female", count: 6 },
    { gender: "Male", count: 6 },
  ],

  // Performance metrics
  approvalRate: 60, // approved / (approved + rejected) × 100
  avgPointsApproved: 52,
  avgPointsRejected: 38,
};

// ── 12 mock applications ──────────────────────────────────────
// Last names intentionally span A–Z so alphabetical sorting is
// visually obvious when testing page-1 (10 items) vs page-2 (2 items).
//
// Alphabetical order by lastName:
//  1. Bizimana     (B)
//  2. Hakizimana   (H)
//  3. Ingabire     (I)
//  4. Iradukunda   (I)
//  5. Mugisha      (M)
//  6. Mukandori    (M)
//  7. Niyonzima    (N)
//  8. Nzeyimana    (N)
//  9. Tuyishime    (T)
// 10. Uwimana      (U)  ← end of page 1
// 11. Uwizeyimana  (U)
// 12. Zigiranyirazo(Z)  ← page 2
export const MOCK_APPLICATIONS = [
  // ── app-001 · Alice Uwimana · UNDER_REVIEW ──────────────────
  {
    id: "app-001",
    applicantId: "mock-001",
    nid: "1199880012345678",
    firstName: "Alice",
    lastName: "Uwimana",
    dateOfBirth: "1998-03-15",
    gender: "FEMALE" as const,
    nationality: "Rwandan",
    address: "KG 123 St, Kimihurura",
    province: "Kigali",
    district: "Gasabo",
    phoneNumber: "+250781234567",
    email: "alice@example.com",
    nesaIndexNumber: "G054-059-003-2018",
    schoolName: "Lycée de Kigali",
    combinationName: "Mathematics-Physics-Computer Science (MPC)",
    yearOfCompletion: 2018,
    totalPoints: 53,
    division: "Division I",
    positionAppliedFor: "Software Engineer",
    coverLetter:
      "I am a passionate software developer with 3 years of experience building scalable web applications. My skills in React and Node.js make me an ideal candidate for this role. I thrive in collaborative environments and am eager to contribute to your engineering team.",
    cvFileName: "alice_uwimana_cv.pdf",
    cvUrl: "#",
    status: "UNDER_REVIEW" as const,
    reviewedBy: undefined,
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
  },

  // ── app-002 · Bruno Nzeyimana · APPROVED ────────────────────
  {
    id: "app-002",
    applicantId: "mock-004",
    nid: "1199780098765432",
    firstName: "Bruno",
    lastName: "Nzeyimana",
    dateOfBirth: "1997-07-22",
    gender: "MALE" as const,
    nationality: "Rwandan",
    address: "KN 45 Ave, Nyamirambo",
    province: "Kigali",
    district: "Nyarugenge",
    phoneNumber: "+250788765432",
    email: "bruno@example.com",
    nesaIndexNumber: "G021-033-007-2017",
    schoolName: "Groupe Scolaire Officiel de Butare",
    combinationName: "Biology-Chemistry-Physics (BCB)",
    yearOfCompletion: 2017,
    totalPoints: 48,
    division: "Division I",
    positionAppliedFor: "Data Analyst",
    coverLetter:
      "With a strong background in data analysis and statistical modeling, I am excited to contribute to your team's data-driven decision-making processes. I have hands-on experience with Python and Excel-based analytics from university projects.",
    cvFileName: "bruno_nzeyimana_cv.pdf",
    cvUrl: "#",
    status: "APPROVED" as const,
    reviewedBy: "mock-002",
    reviewerName: "Jean Habimana",
    reviewReason:
      "Excellent academic background with Division I results and strong analytical skills clearly demonstrated in the cover letter.",
    reviewedAt: "2024-01-17T14:00:00Z",
    createdAt: "2024-01-14T08:00:00Z",
    updatedAt: "2024-01-17T14:00:00Z",
  },

  // ── app-003 · Claudine Ingabire · SUBMITTED ─────────────────
  {
    id: "app-003",
    applicantId: "mock-005",
    nid: "1200080045678901",
    firstName: "Claudine",
    lastName: "Ingabire",
    dateOfBirth: "2000-11-05",
    gender: "FEMALE" as const,
    nationality: "Rwandan",
    address: "KK 78 Rd, Kagarama",
    province: "Southern",
    district: "Huye",
    phoneNumber: "+250792345678",
    email: "claudine@example.com",
    nesaIndexNumber: "S012-044-009-2020",
    schoolName: "École Secondaire de Nyanza",
    combinationName: "Accounting-Economics-Mathematics (AEG)",
    yearOfCompletion: 2020,
    totalPoints: 44,
    division: "Division II",
    positionAppliedFor: "Finance Officer",
    coverLetter:
      "My background in accounting and economics, combined with strong analytical skills, positions me well for the Finance Officer role. I am detail-oriented, deadline-driven, and excited to bring value to your finance team.",
    cvFileName: "claudine_ingabire_cv.pdf",
    cvUrl: "#",
    status: "SUBMITTED" as const,
    reviewedBy: undefined,
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
    createdAt: "2024-01-18T11:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },

  // ── app-004 · David Hakizimana · REJECTED ───────────────────
  {
    id: "app-004",
    applicantId: "mock-006",
    nid: "1199980034567890",
    firstName: "David",
    lastName: "Hakizimana",
    dateOfBirth: "1999-04-18",
    gender: "MALE" as const,
    nationality: "Rwandan",
    address: "KE 12 Blvd, Rwamagana",
    province: "Eastern",
    district: "Rwamagana",
    phoneNumber: "+250783456789",
    email: "david@example.com",
    nesaIndexNumber: "E033-055-002-2019",
    schoolName: "Collège Saint André",
    combinationName: "History-Geography-Economics (HGE)",
    yearOfCompletion: 2019,
    totalPoints: 39,
    division: "Division II",
    positionAppliedFor: "Project Coordinator",
    coverLetter:
      "I have a deep passion for community development and project management. My studies in geography and economics have equipped me with the tools needed for effective coordination across teams and stakeholders.",
    cvFileName: "david_hakizimana_cv.pdf",
    cvUrl: "#",
    status: "REJECTED" as const,
    reviewedBy: "mock-002",
    reviewerName: "Jean Habimana",
    reviewReason:
      "The applicant does not meet the minimum qualification of Division I required for this role. We encourage reapplication after further qualification.",
    reviewedAt: "2024-01-16T10:00:00Z",
    createdAt: "2024-01-13T09:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },

  // ── app-005 · Esperance Mukandori · SUBMITTED ───────────────
  {
    id: "app-005",
    applicantId: "mock-007",
    nid: "1200180056789012",
    firstName: "Esperance",
    lastName: "Mukandori",
    dateOfBirth: "2001-02-28",
    gender: "FEMALE" as const,
    nationality: "Rwandan",
    address: "NB 55 St, Musanze",
    province: "Northern",
    district: "Musanze",
    phoneNumber: "+250796789012",
    email: "esperance@example.com",
    nesaIndexNumber: "N044-066-001-2021",
    schoolName: "Groupe Scolaire de Musanze",
    combinationName: "Mathematics-Physics-Computer Science (MPC)",
    yearOfCompletion: 2021,
    totalPoints: 56,
    division: "Division I",
    positionAppliedFor: "Network Engineer",
    coverLetter:
      "As a recent graduate with top marks in computer science and physics, I am eager to apply my knowledge to real-world networking challenges. I am a fast learner committed to continuous professional growth.",
    cvFileName: "esperance_mukandori_cv.pdf",
    cvUrl: "#",
    status: "SUBMITTED" as const,
    reviewedBy: undefined,
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
    createdAt: "2024-01-19T07:30:00Z",
    updatedAt: "2024-01-19T07:30:00Z",
  },

  // ── app-006 · Fidele Iradukunda · UNDER_REVIEW ──────────────
  {
    id: "app-006",
    applicantId: "mock-009",
    nid: "1200080067890123",
    firstName: "Fidele",
    lastName: "Iradukunda",
    dateOfBirth: "2000-06-14",
    gender: "MALE" as const,
    nationality: "Rwandan",
    address: "WB 33 Ave, Rubavu",
    province: "Western",
    district: "Rubavu",
    phoneNumber: "+250784567890",
    email: "fidele@example.com",
    nesaIndexNumber: "W011-022-005-2020",
    schoolName: "Lycée Notre Dame de Citeaux",
    combinationName: "Physics-Chemistry-Mathematics (PCM)",
    yearOfCompletion: 2020,
    totalPoints: 51,
    division: "Division I",
    positionAppliedFor: "Systems Administrator",
    coverLetter:
      "I have a solid foundation in physics and mathematics which I have channelled into a strong interest in systems administration and IT infrastructure. I am eager to contribute to a stable and efficient IT environment.",
    cvFileName: "fidele_iradukunda_cv.pdf",
    cvUrl: "#",
    status: "UNDER_REVIEW" as const,
    reviewedBy: undefined,
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-21T08:00:00Z",
  },

  // ── app-007 · Grace Tuyishime · APPROVED ────────────────────
  {
    id: "app-007",
    applicantId: "mock-010",
    nid: "1199980078901234",
    firstName: "Grace",
    lastName: "Tuyishime",
    dateOfBirth: "1999-09-30",
    gender: "FEMALE" as const,
    nationality: "Rwandan",
    address: "KG 500 Ave, Kacyiru",
    province: "Kigali",
    district: "Gasabo",
    phoneNumber: "+250785678901",
    email: "grace@example.com",
    nesaIndexNumber: "G077-088-004-2019",
    schoolName: "Groupe Scolaire Officiel de Kigali",
    combinationName: "Biology-Chemistry-Physics (BCB)",
    yearOfCompletion: 2019,
    totalPoints: 55,
    division: "Division I",
    positionAppliedFor: "Public Health Officer",
    coverLetter:
      "Having graduated top of my class in biology and chemistry, I am deeply passionate about public health. I have volunteered at community health clinics and am committed to improving healthcare access across Rwanda.",
    cvFileName: "grace_tuyishime_cv.pdf",
    cvUrl: "#",
    status: "APPROVED" as const,
    reviewedBy: "mock-002",
    reviewerName: "Jean Habimana",
    reviewReason:
      "Outstanding academic record and demonstrated community health experience. A strong fit for the Public Health Officer role.",
    reviewedAt: "2024-01-22T11:00:00Z",
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-01-22T11:00:00Z",
  },

  // ── app-008 · Honoré Bizimana · SUBMITTED ───────────────────
  {
    id: "app-008",
    applicantId: "mock-011",
    nid: "1200180089012345",
    firstName: "Honoré",
    lastName: "Bizimana",
    dateOfBirth: "2001-12-10",
    gender: "MALE" as const,
    nationality: "Rwandan",
    address: "SB 22 Rd, Nyanza",
    province: "Southern",
    district: "Nyanza",
    phoneNumber: "+250786789012",
    email: "honore@example.com",
    nesaIndexNumber: "S033-055-008-2021",
    schoolName: "Groupe Scolaire de Nyanza",
    combinationName: "Mathematics-Computer Science-Economics (MCE)",
    yearOfCompletion: 2021,
    totalPoints: 49,
    division: "Division I",
    positionAppliedFor: "Business Analyst",
    coverLetter:
      "I combine a strong quantitative background with a deep interest in business strategy. Through my studies in mathematics and economics I developed the ability to model complex problems and communicate findings clearly to stakeholders.",
    cvFileName: "honore_bizimana_cv.pdf",
    cvUrl: "#",
    status: "SUBMITTED" as const,
    reviewedBy: undefined,
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
    createdAt: "2024-01-21T10:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
  },

  // ── app-009 · Immaculee Niyonzima · SUBMITTED ───────────────
  {
    id: "app-009",
    applicantId: "mock-012",
    nid: "1199780090123456",
    firstName: "Immaculee",
    lastName: "Niyonzima",
    dateOfBirth: "1997-05-25",
    gender: "FEMALE" as const,
    nationality: "Rwandan",
    address: "EB 15 St, Kayonza",
    province: "Eastern",
    district: "Kayonza",
    phoneNumber: "+250787890123",
    email: "immaculee@example.com",
    nesaIndexNumber: "E055-077-006-2017",
    schoolName: "Groupe Scolaire de Kayonza",
    combinationName: "Literature-Languages-Social Sciences (LLS)",
    yearOfCompletion: 2017,
    totalPoints: 46,
    division: "Division I",
    positionAppliedFor: "Communications Officer",
    coverLetter:
      "My background in literature and social sciences has given me exceptional written and verbal communication skills. I am passionate about crafting clear, impactful messages and have experience managing content for student publications.",
    cvFileName: "immaculee_niyonzima_cv.pdf",
    cvUrl: "#",
    status: "SUBMITTED" as const,
    reviewedBy: undefined,
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
    createdAt: "2024-01-22T08:30:00Z",
    updatedAt: "2024-01-22T08:30:00Z",
  },

  // ── app-010 · Jean-Pierre Mugisha · REJECTED ────────────────
  {
    id: "app-010",
    applicantId: "mock-013",
    nid: "1200080001234567",
    firstName: "Jean-Pierre",
    lastName: "Mugisha",
    dateOfBirth: "2000-03-08",
    gender: "MALE" as const,
    nationality: "Rwandan",
    address: "KN 200 St, Kimisagara",
    province: "Kigali",
    district: "Nyarugenge",
    phoneNumber: "+250788901234",
    email: "jeanpierre@example.com",
    nesaIndexNumber: "G088-099-007-2020",
    schoolName: "Collège du Christ-Roi",
    combinationName: "History-Geography-Economics (HGE)",
    yearOfCompletion: 2020,
    totalPoints: 38,
    division: "Division II",
    positionAppliedFor: "Administrative Assistant",
    coverLetter:
      "I am organised, proactive and a strong communicator. Through my studies and part-time work experience I have developed solid administrative skills including scheduling, documentation and stakeholder correspondence.",
    cvFileName: "jeanpierre_mugisha_cv.pdf",
    cvUrl: "#",
    status: "REJECTED" as const,
    reviewedBy: "mock-002",
    reviewerName: "Jean Habimana",
    reviewReason:
      "The role requires a minimum of Division I qualification. We appreciate the application and encourage the candidate to reapply in future rounds.",
    reviewedAt: "2024-01-23T09:00:00Z",
    createdAt: "2024-01-21T15:00:00Z",
    updatedAt: "2024-01-23T09:00:00Z",
  },

  // ── app-011 · Kevine Uwizeyimana · APPROVED ─────────────────
  {
    id: "app-011",
    applicantId: "mock-014",
    nid: "1200180012345670",
    firstName: "Kevine",
    lastName: "Uwizeyimana",
    dateOfBirth: "2001-08-17",
    gender: "FEMALE" as const,
    nationality: "Rwandan",
    address: "KG 88 Ave, Kicukiro",
    province: "Kigali",
    district: "Kicukiro",
    phoneNumber: "+250789012345",
    email: "kevine@example.com",
    nesaIndexNumber: "G099-011-002-2021",
    schoolName: "Lycée de Kigali",
    combinationName: "Mathematics-Physics-Computer Science (MPC)",
    yearOfCompletion: 2021,
    totalPoints: 58,
    division: "Division I",
    positionAppliedFor: "Junior Developer",
    coverLetter:
      "I graduated top of my cohort in computer science and am eager to begin my professional career in software development. I have built several projects including a student management system and a mobile budgeting app during my studies.",
    cvFileName: "kevine_uwizeyimana_cv.pdf",
    cvUrl: "#",
    status: "APPROVED" as const,
    reviewedBy: "mock-002",
    reviewerName: "Jean Habimana",
    reviewReason:
      "Highest academic score in the current cohort (58 pts, Division I) combined with practical project experience. Highly recommended for the Junior Developer role.",
    reviewedAt: "2024-01-23T14:00:00Z",
    createdAt: "2024-01-22T12:00:00Z",
    updatedAt: "2024-01-23T14:00:00Z",
  },

  // ── app-012 · Leon Zigiranyirazo · SUBMITTED ────────────────
  {
    id: "app-012",
    applicantId: "mock-015",
    nid: "1199980023456781",
    firstName: "Leon",
    lastName: "Zigiranyirazo",
    dateOfBirth: "1999-11-03",
    gender: "MALE" as const,
    nationality: "Rwandan",
    address: "NB 44 Rd, Ruhengeri",
    province: "Northern",
    district: "Musanze",
    phoneNumber: "+250780123456",
    email: "leon@example.com",
    nesaIndexNumber: "N066-088-003-2019",
    schoolName: "Groupe Scolaire Officiel de Ruhengeri",
    combinationName: "Mathematics-Physics-Computer Science (MPC)",
    yearOfCompletion: 2019,
    totalPoints: 52,
    division: "Division I",
    positionAppliedFor: "IT Support Specialist",
    coverLetter:
      "With a strong background in mathematics and computer science, I am well-suited to provide technical support and maintain IT systems. I am patient, methodical and passionate about solving technical problems for end users.",
    cvFileName: "leon_zigiranyirazo_cv.pdf",
    cvUrl: "#",
    status: "SUBMITTED" as const,
    reviewedBy: undefined,
    reviewerName: undefined,
    reviewReason: undefined,
    reviewedAt: undefined,
    createdAt: "2024-01-23T16:00:00Z",
    updatedAt: "2024-01-23T16:00:00Z",
  },
];

// ── Mock users list for admin ────────────────────────────────
export const MOCK_USERS_LIST = [
  MOCK_USERS["applicant@demo.com"].user,
  MOCK_USERS["hr@demo.com"].user,
  MOCK_USERS["admin@demo.com"].user,
  {
    id: "mock-004",
    email: "bruno@example.com",
    firstName: "Bruno",
    lastName: "Nzeyimana",
    role: "APPLICANT" as const,
    isActive: true,
    createdAt: "2024-01-14T08:00:00Z",
    updatedAt: "2024-01-14T08:00:00Z",
  },
  {
    id: "mock-005",
    email: "claudine@example.com",
    firstName: "Claudine",
    lastName: "Ingabire",
    role: "APPLICANT" as const,
    isActive: true,
    createdAt: "2024-01-18T11:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
  {
    id: "mock-008",
    email: "hr2@demo.com",
    firstName: "Patrick",
    lastName: "Nkurunziza",
    role: "HR" as const,
    isActive: false,
    createdAt: "2024-01-03T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
];
