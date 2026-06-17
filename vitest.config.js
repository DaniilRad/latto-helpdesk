import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure-logic suite — no DOM needed. Add `environment: "jsdom"` later if we
    // start testing components.
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
  },
});
