import { describe, expect, it } from "vitest";
import { contentBlockSchema } from "@/validation/cms";
describe("CMS validation", () => {
  it("accepts a defined content block", () => { expect(contentBlockSchema.safeParse({ area: "CONTACT", key: "overview", fields: { heading: "Contact", description: "Reach us" }, removeImage: false }).success).toBe(true); });
  it("rejects unknown sections", () => { expect(contentBlockSchema.safeParse({ area: "CONTACT", key: "unknown", fields: {}, removeImage: false }).success).toBe(false); });
});
