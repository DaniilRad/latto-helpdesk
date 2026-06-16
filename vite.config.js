import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// On GitHub Pages this is served from a project subpath (/latto-helpdesk/),
// so production builds use that base. Dev keeps the root path for convenience.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/latto-helpdesk/" : "/",
  plugins: [react()],
  server: { port: 5180 },
}));
