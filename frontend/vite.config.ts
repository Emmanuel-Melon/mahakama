import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// ↓ add this
import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(),
    tsconfigPaths(),
    // netlifyReactRouter() // ← add this
  ]
});
// import { reactRouter } from "@react-router/dev/vite";

// import { defineConfig } from "vite";
// import tsconfigPaths from "vite-tsconfig-paths";
// import netlifyPlugin from "@netlify/vite-plugin-react-router";

// export default defineConfig({
//   plugins: [reactRouter(), tailwindcss(), tsconfigPaths(), netlifyPlugin()],
// });


// import { reactRouter } from "@react-router/dev/vite";
// import { defineConfig } from "vite";
// import tsconfigPaths from "vite-tsconfig-paths";
// import netlifyReactRouter from "@netlify/vite-plugin-react-router";

// export default defineConfig({
//   plugins: [
//     reactRouter(),
//     tsconfigPaths(),
//     netlifyReactRouter()
//   ]
// });

// import { reactRouter } from "@react-router/dev/vite";
// import autoprefixer from "autoprefixer";
// import tailwindcss from "tailwindcss";
// import { defineConfig } from "vite";
// import tsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig({
//   plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
// });