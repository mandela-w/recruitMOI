import {
  cn,
  formatDate,
  getInitials,
  truncate,
  calculatePercentage,
  formatFileSize,
  timeAgo,
  statusConfig,
  roleConfig,
} from "@/lib/utils";

describe("cn (className merge utility)", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const active = true;
    expect(cn("base", active && "active")).toBe("base active");
  });

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null as unknown as string, "extra")).toBe("base extra");
  });
});

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toContain("2024");
    expect(result).toContain("15");
  });

  it("handles leap year dates", () => {
    const result = formatDate("2024-02-29T00:00:00Z");
    expect(result).toContain("2024");
  });
});

describe("getInitials", () => {
  it("returns uppercase initials", () => {
    expect(getInitials("John", "Doe")).toBe("JD");
  });

  it("handles single character names", () => {
    expect(getInitials("A", "B")).toBe("AB");
  });

  it("handles lowercase input", () => {
    expect(getInitials("john", "doe")).toBe("JD");
  });
});

describe("truncate", () => {
  it("does not truncate short strings", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates long strings", () => {
    const result = truncate("Hello World", 5);
    expect(result).toBe("Hello...");
    expect(result.length).toBeLessThanOrEqual(8);
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});

describe("calculatePercentage", () => {
  it("calculates percentage correctly", () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(1, 4)).toBe(25);
    expect(calculatePercentage(3, 4)).toBe(75);
  });

  it("returns 0 for zero total", () => {
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

describe("formatFileSize", () => {
  it("formats bytes correctly", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1024 * 1024)).toBe("1 MB");
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe("2.5 MB");
  });
});

describe("statusConfig", () => {
  it("contains all expected statuses", () => {
    const expected = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    expected.forEach((status) => {
      expect(statusConfig).toHaveProperty(status);
    });
  });

  it("each status has required fields", () => {
    Object.values(statusConfig).forEach((config) => {
      expect(config).toHaveProperty("label");
      expect(config).toHaveProperty("color");
      expect(config).toHaveProperty("dot");
      expect(typeof config.label).toBe("string");
    });
  });
});

describe("roleConfig", () => {
  it("contains all expected roles", () => {
    const expected = ["APPLICANT", "HR", "SUPER_ADMIN"];
    expected.forEach((role) => {
      expect(roleConfig).toHaveProperty(role);
    });
  });
});

describe("timeAgo", () => {
  it("returns 'Just now' for very recent times", () => {
    const justNow = new Date().toISOString();
    expect(timeAgo(justNow)).toBe("Just now");
  });

  it("returns minutes ago for recent times", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(timeAgo(fiveMinutesAgo)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(twoHoursAgo)).toBe("2h ago");
  });
});
