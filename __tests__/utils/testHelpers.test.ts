/**
 * Test file for test helpers
 * This ensures the testHelpers file is recognized as a test file
 */

import { mockUser, mockStory, mockSubscription } from "./testHelpers";

describe("Test Helpers", () => {
  it("should export mock user data", () => {
    expect(mockUser).toBeDefined();
    expect(mockUser.id).toBeDefined();
    expect(mockUser.email).toBeDefined();
  });

  it("should export mock story data", () => {
    expect(mockStory).toBeDefined();
    expect(mockStory.id).toBeDefined();
    expect(mockStory.title).toBeDefined();
  });

  it("should export mock subscription data", () => {
    expect(mockSubscription).toBeDefined();
    expect(mockSubscription.id).toBeDefined();
    expect(mockSubscription.plan_type).toBeDefined();
  });
});
