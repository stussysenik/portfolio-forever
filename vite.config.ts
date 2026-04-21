import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";
import path from "path";

const STATE_ENGINE = process.env.PUBLIC_STATE_ENGINE || "svelte";

export default defineConfig({
        plugins: [
                sveltekit(),
                Icons({ compiler: "svelte", autoInstall: false }),
        ],
        envPrefix: ["VITE_", "PUBLIC_", "NEXT_PUBLIC_"],
        resolve: {
                alias: {
                        "$convex": path.resolve("./convex"),
                        "$core": path.resolve(`./src/lib/core/${STATE_ENGINE}`),
                },
        },
        optimizeDeps: {
                exclude: ["fengari-web"],
        },
        server: {
                fs: {
                        allow: ["convex"],
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