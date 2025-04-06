import { describe, it, expect } from "vitest";

describe("test hello world", () => {
  it("should return hello world", () => {
    expect("hello world").toBe("hello world");
  });
});

export {};
