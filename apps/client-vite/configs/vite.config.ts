import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rootDir = path.resolve(__dirname, "../src");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), "");
  return {
    plugins: [react(), tailwindcss()],
    root: rootDir,
    mode: env.VITE_MODE ?? "development",
    publicDir: path.resolve(rootDir, "../public"),
    server: {
      host: env.VITE_HOST ?? "localhost",
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 4000,
      proxy: {
        "/api": `http://${env.VITE_API_HOST ?? "localhost"}:${env.VITE_API_PORT ?? 5000}`,
      },
    },
    resolve: {
      alias: {
        "@": rootDir,
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(rootDir, "index.html"),
        },
        output: {
          entryFileNames: `[name].bundle.[hash].js`,
          chunkFileNames: `chunks/[name].[hash].js`,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return `css/[name].[hash].css`;
            }
            return `assets/[name].[hash].[ext]`;
          },
          manualChunks(id) {
            if (id.includes("react")) {
              return "react-vendor";
            } else if (id.includes("@wp")) {
              return "wp-libs";
            } else if (id.includes("node_modules")) {
              return "vendors";
            }
          },
        },
      },
      outDir:
        env.VITE_MODE === "production"
          ? path.resolve(rootDir, "../../../dist/public")
          : path.resolve(rootDir, "../dist"),
      minify: "terser",
      emptyOutDir: true,
    },
  };
});
