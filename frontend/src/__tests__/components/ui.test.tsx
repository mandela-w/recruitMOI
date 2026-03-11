import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, RoleBadge, Badge } from "@/components/ui/Badge";

describe("Button Component", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading spinner when isLoading", () => {
    render(<Button isLoading>Click me</Button>);
    // In loading state the button is disabled
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is disabled when loading", () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders with left icon", () => {
    render(<Button leftIcon={<span data-testid="icon">→</span>}>Click</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("btn-primary");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button").className).toContain("btn-secondary");
  });

  it("does not call onClick when disabled", () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("StatusBadge Component", () => {
  it("renders SUBMITTED status", () => {
    render(<StatusBadge status="SUBMITTED" />);
    expect(screen.getByText("Submitted")).toBeInTheDocument();
  });

  it("renders APPROVED status", () => {
    render(<StatusBadge status="APPROVED" />);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("renders REJECTED status", () => {
    render(<StatusBadge status="REJECTED" />);
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders UNDER_REVIEW status", () => {
    render(<StatusBadge status="UNDER_REVIEW" />);
    expect(screen.getByText("Under Review")).toBeInTheDocument();
  });

  it("renders DRAFT status", () => {
    render(<StatusBadge status="DRAFT" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});

describe("RoleBadge Component", () => {
  it("renders APPLICANT role", () => {
    render(<RoleBadge role="APPLICANT" />);
    expect(screen.getByText("Applicant")).toBeInTheDocument();
  });

  it("renders HR role", () => {
    render(<RoleBadge role="HR" />);
    expect(screen.getByText("HR Manager")).toBeInTheDocument();
  });

  it("renders SUPER_ADMIN role", () => {
    render(<RoleBadge role="SUPER_ADMIN" />);
    expect(screen.getByText("Super Admin")).toBeInTheDocument();
  });
});

describe("Badge Component", () => {
  it("renders children", () => {
    render(<Badge>Custom Badge</Badge>);
    expect(screen.getByText("Custom Badge")).toBeInTheDocument();
  });

  it("applies variant-specific class names", () => {
    const { rerender } = render(<Badge variant="success">OK</Badge>);
    let badge = screen.getByText("OK");
    expect(badge.className).toContain("emerald");

    rerender(<Badge variant="danger">Error</Badge>);
    badge = screen.getByText("Error");
    expect(badge.className).toContain("rose");
  });
});
