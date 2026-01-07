import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    netlifyReactRouter()
  ]
});