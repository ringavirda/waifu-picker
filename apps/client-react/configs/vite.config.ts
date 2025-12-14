import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rootDir = path.resolve(__dirname, "../src");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), "");
  return {
    base: env.VITE_MODE === "production" ? "/waifu-new/" : "/",
    plugins: [
      react({
        include: /\.[jt]sx?$/,
        babel: {
          plugins: [
            ["babel-plugin-parameter-decorator"],
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
          ],
        },
      }),
      tailwindcss(),
    ],
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
            // only match packages inside node_modules to avoid accidental matches in project files
            const nm = path.sep + "node_modules" + path.sep;
            if (
              id.includes(nm + "react" + path.sep) ||
              id.includes(nm + "react-dom" + path.sep)
            ) {
              return "react-vendor";
            } else if (id.includes(nm + "@wp" + path.sep)) {
              return "wp-libs";
            } else if (id.includes(nm)) {
              return "vendors";
            }
            return undefined;
          },
        },
      },
      outDir: path.resolve(rootDir, "../dist"),
      minify: "terser",
      emptyOutDir: true,
    },
  };
});
