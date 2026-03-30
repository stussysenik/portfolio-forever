import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
        plugins: [sveltekit()],
        resolve: {
                alias: {
                        "$convex": path.resolve("./convex"),
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
});
