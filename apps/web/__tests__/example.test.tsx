import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button UI Component", () => {
  it("renders button label correctly", () => {
    render(<Button>FounderHQ Button</Button>);
    expect(screen.getByRole("button", { name: /founderhq button/i })).toBeDefined();
  });
});
