import {
  loginSchema,
  registerSchema,
  nidSchema,
  nesaSchema,
  applicationDetailsSchema,
  reviewSchema,
  createUserSchema,
} from "@/lib/validators/schemas";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "pass" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("email"))).toBe(true);
    }
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "123" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "Password1",
    confirmPassword: "Password1",
  };

  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(validData).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPassword1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("confirmPassword"))).toBe(true);
    }
  });

  it("requires uppercase letter in password", () => {
    const result = registerSchema.safeParse({ ...validData, password: "password1", confirmPassword: "password1" });
    expect(result.success).toBe(false);
  });

  it("requires number in password", () => {
    const result = registerSchema.safeParse({ ...validData, password: "Password", confirmPassword: "Password" });
    expect(result.success).toBe(false);
  });

  it("rejects too-short first name", () => {
    const result = registerSchema.safeParse({ ...validData, firstName: "J" });
    expect(result.success).toBe(false);
  });
});

describe("nidSchema", () => {
  it("accepts valid 16-digit NID", () => {
    expect(nidSchema.safeParse({ nid: "1199880012345678" }).success).toBe(true);
  });

  it("rejects NID with letters", () => {
    expect(nidSchema.safeParse({ nid: "119988001234567A" }).success).toBe(false);
  });

  it("rejects short NID", () => {
    expect(nidSchema.safeParse({ nid: "12345" }).success).toBe(false);
  });

  it("rejects 17-digit NID", () => {
    expect(nidSchema.safeParse({ nid: "12345678901234567" }).success).toBe(false);
  });
});

describe("nesaSchema", () => {
  it("accepts valid index number", () => {
    expect(nesaSchema.safeParse({ nesaIndexNumber: "G054-059-003-2018" }).success).toBe(true);
  });

  it("rejects too short index", () => {
    expect(nesaSchema.safeParse({ nesaIndexNumber: "G054" }).success).toBe(false);
  });
});

describe("applicationDetailsSchema", () => {
  const validData = {
    positionAppliedFor: "Software Engineer",
    coverLetter: "A".repeat(150),
    email: "applicant@example.com",
    phoneNumber: "+250781234567",
  };

  it("accepts valid application data", () => {
    expect(applicationDetailsSchema.safeParse(validData).success).toBe(true);
  });

  it("rejects short cover letter", () => {
    const result = applicationDetailsSchema.safeParse({ ...validData, coverLetter: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone number", () => {
    const result = applicationDetailsSchema.safeParse({ ...validData, phoneNumber: "abc" });
    expect(result.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("accepts APPROVED with reason", () => {
    expect(reviewSchema.safeParse({ status: "APPROVED", reason: "Excellent qualifications for the role" }).success).toBe(true);
  });

  it("accepts REJECTED with reason", () => {
    expect(reviewSchema.safeParse({ status: "REJECTED", reason: "Does not meet minimum requirements" }).success).toBe(true);
  });

  it("rejects invalid status", () => {
    expect(reviewSchema.safeParse({ status: "PENDING", reason: "Some reason" }).success).toBe(false);
  });

  it("rejects too-short reason", () => {
    expect(reviewSchema.safeParse({ status: "APPROVED", reason: "OK" }).success).toBe(false);
  });
});
