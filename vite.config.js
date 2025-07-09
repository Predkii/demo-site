import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        onboarding: resolve(__dirname, "results.html"),
      },
    },
  },
  base:"/demo-site/",
});