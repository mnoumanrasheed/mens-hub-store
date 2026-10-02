import { describe, expect, it } from "vitest";

import {
  formatDeliveryMessage,
  STANDARD_DELIVERY_MESSAGE,
} from "./delivery";

describe("delivery messaging", () => {
  it.each([
    "",
    "Calculated / Confirmed on WhatsApp",
    "Delivery is discussed on WhatsApp",
    "Delivery charges will be confirmed separately on WhatsApp",
  ])("replaces a legacy or empty message: %s", (message) => {
    expect(formatDeliveryMessage(message)).toBe(STANDARD_DELIVERY_MESSAGE);
  });

  it("preserves an intentional custom delivery message", () => {
    expect(formatDeliveryMessage("Same-day Bhalwal delivery is free."))
      .toBe("Same-day Bhalwal delivery is free.");
  });
});
