import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
