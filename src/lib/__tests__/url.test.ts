import { describe, it, expect } from "vitest";
import { isValidUrl, safeHref } from "../url";

describe("isValidUrl", () => {
  it("accepts valid https URL", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("https://ankiweb.net/shared/decks/spanish")).toBe(true);
  });

  it("accepts valid http URL", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("accepts empty string as no-url (used for resources without links)", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("   ")).toBe(false);
  });

  it("rejects javascript: scheme", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("javascript:void(0)")).toBe(false);
  });

  it("rejects data: scheme", () => {
    expect(isValidUrl("data:text/html,<h1>hello</h1>")).toBe(false);
  });

  it("rejects vbscript: scheme", () => {
    expect(isValidUrl("vbscript:msgbox('x')")).toBe(false);
  });

  it("rejects file: scheme", () => {
    expect(isValidUrl("file:///etc/passwd")).toBe(false);
  });

  it("rejects URL with no protocol", () => {
    expect(isValidUrl("example.com")).toBe(false);
    expect(isValidUrl("ankiweb.net")).toBe(false);
  });

  it("rejects null and non-string inputs", () => {
    expect(isValidUrl(null as unknown as string)).toBe(false);
    expect(isValidUrl(undefined as unknown as string)).toBe(false);
    expect(isValidUrl(123 as unknown as string)).toBe(false);
  });

  it("rejects URL with javascript in path (not scheme)", () => {
    // This should be rejected by the blocked patterns check
    expect(isValidUrl("https://example.com/javajavascript:alert(1)")).toBe(false);
  });

  it("accepts URL with query params and fragments", () => {
    expect(isValidUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(isValidUrl("https://example.com/path?foo=bar#anchor")).toBe(true);
  });

  it("accepts URL with port", () => {
    expect(isValidUrl("http://localhost:3000/api")).toBe(true);
    expect(isValidUrl("https://example.com:8080/path")).toBe(true);
  });
});

describe("safeHref", () => {
  it("returns valid URL unchanged", () => {
    expect(safeHref("https://ankiweb.net")).toBe("https://ankiweb.net");
  });

  it("returns '#' for invalid URLs", () => {
    expect(safeHref("javascript:alert(1)")).toBe("#");
    expect(safeHref("")).toBe("#");
    expect(safeHref("not-a-url")).toBe("#");
    expect(safeHref("data:x")).toBe("#");
  });

  it("returns '#' for null/undefined", () => {
    expect(safeHref(null as unknown as string)).toBe("#");
    expect(safeHref(undefined as unknown as string)).toBe("#");
  });
});