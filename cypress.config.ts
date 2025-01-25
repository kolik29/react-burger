import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    chromeWebSecurity: false
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
