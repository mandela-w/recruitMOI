import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  const React = require("react");
  return React.forwardRef(({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }, ref: React.Ref<HTMLAnchorElement>) =>
    React.createElement("a", { href, ref, ...props }, children)
  );
});

// Suppress console.error for expected errors
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") || args[0].includes("Warning: An update"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
