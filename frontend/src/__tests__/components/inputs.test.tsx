import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

describe("Input Component", () => {
  it("renders with label", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows required asterisk when required", () => {
    render(<Input label="Email" name="email" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input name="email" error="Email is required" />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("shows hint when no error", () => {
    render(<Input name="email" hint="Enter your email" />);
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("hides hint when error is shown", () => {
    render(<Input name="email" hint="Enter your email" error="Required" />);
    expect(screen.queryByText("Enter your email")).not.toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("handles user input", () => {
    render(<Input name="email" placeholder="Enter email" />);
    const input = screen.getByPlaceholderText("Enter email");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect((input as HTMLInputElement).value).toBe("test@example.com");
  });

  it("applies error styling when error is present", () => {
    render(<Input name="email" error="Error" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("input-error");
  });

  it("renders with left icon", () => {
    render(<Input name="search" leftIcon={<span data-testid="search-icon">🔍</span>} />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });
});

describe("Textarea Component", () => {
  it("renders with label", () => {
    render(<Textarea label="Description" name="desc" />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("shows character count when showCount and maxLength provided", () => {
    render(<Textarea name="text" showCount maxLength={200} value="Hello" onChange={() => {}} />);
    expect(screen.getByText("5/200")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Textarea name="text" error="Too short" />);
    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  it("handles text input", () => {
    render(<Textarea name="text" placeholder="Write here..." />);
    const textarea = screen.getByPlaceholderText("Write here...");
    fireEvent.change(textarea, { target: { value: "Sample text" } });
    expect((textarea as HTMLTextAreaElement).value).toBe("Sample text");
  });
});
