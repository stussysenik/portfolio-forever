import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";
import path from "path";
import squintPlugin from "./vite-plugin-squint";

const STATE_ENGINE = process.env.PUBLIC_STATE_ENGINE || "clojure";

export default defineConfig({
        plugins: [
                sveltekit(),
                Icons({ compiler: "svelte", autoInstall: false }),
                squintPlugin({ srcDir: "src/lib/clj", outDir: "src/lib/clj" }),
        ],
        envPrefix: ["VITE_", "PUBLIC_", "NEXT_PUBLIC_"],
        resolve: {
                alias: {
                        "$convex": path.resolve("./convex"),
                        "$clj": path.resolve("./clj"),
                        "$core": path.resolve(`./src/lib/core/${STATE_ENGINE}`),
                },
        },
        optimizeDeps: {
                exclude: ["fengari-web"],
        },
        server: {
                fs: {
                        allow: ["convex", "clj"],
                },
        },
        build: {
                rollupOptions: {
                        output: {
                                // Cache busting: ensure unique hashes for each build
                                entryFileNames: "[name]-[hash].js",
                                chunkFileNames: "[name]-[hash].js",
                                assetFileNames: "[name]-[hash][extname]",
                        },
                },
        },
});