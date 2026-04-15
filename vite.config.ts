import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";
import path from "path";

export default defineConfig({
        plugins: [
                sveltekit(),
                Icons({ compiler: "svelte", autoInstall: false }),
        ],
        envPrefix: ["VITE_", "PUBLIC_", "NEXT_PUBLIC_"],
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
