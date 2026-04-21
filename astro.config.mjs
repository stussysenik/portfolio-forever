import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tsconfigPaths from "vite-tsconfig-paths";
import Icons from "unplugin-icons/vite";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const env = loadEnv(process.env.NODE_ENV ?? "development", rootDir, "");
const packageJson = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf-8"));
const aliasRoot = (segment) => fileURLToPath(new URL(segment, import.meta.url));
const libRoot = aliasRoot("./src/lib");
const convexRoot = aliasRoot("./convex");
const coreRoot = aliasRoot("./src/lib/core/svelte");

const sanityProjectId = env.VITE_SANITY_PROJECT_ID ?? process.env.VITE_SANITY_PROJECT_ID ?? "py21y2h1";
const sanityDataset = env.VITE_SANITY_DATASET ?? process.env.VITE_SANITY_DATASET ?? "production";
const sanityStudioUrl =
	env.PUBLIC_SANITY_STUDIO_URL ??
	process.env.PUBLIC_SANITY_STUDIO_URL ??
	"/admin/content/studio";

export default defineConfig({
	output: "server",
	adapter: vercel(),
	integrations: [
		react(),
		svelte(),
		sanity({
			projectId: sanityProjectId,
			dataset: sanityDataset,
			apiVersion: "2025-01-01",
			useCdn: true,
			studioBasePath: "/admin/content/studio",
			stega: {
				studioUrl: sanityStudioUrl,
			},
		}),
	],
	vite: {
		envPrefix: ["VITE_", "PUBLIC_", "NEXT_PUBLIC_"],
		define: {
			__APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION ?? packageJson.version ?? "0.0.1"),
			__BUILD_TRACK__: JSON.stringify(env.VITE_BUILD_TRACK ?? process.env.NODE_ENV ?? "astro"),
			__BUILD_HASH__: JSON.stringify(env.VITE_BUILD_HASH ?? "portfolio"),
		},
		plugins: [
			tsconfigPaths(),
			Icons({
				compiler: "svelte",
				autoInstall: true,
			}),
		],
		optimizeDeps: {
			include: [
				"react/compiler-runtime",
				"lodash/isObject.js",
				"lodash/groupBy.js",
				"lodash/keyBy.js",
				"lodash/partition.js",
				"lodash/sortedIndex.js",
				"compromise",
				"remark-gfm",
			],
		},
		resolve: {
			alias: [
				{ find: /^\$lib$/, replacement: libRoot },
				{ find: /^\$convex$/, replacement: convexRoot },
				{ find: /^\$core$/, replacement: coreRoot },
				{ find: /^\$lib\//, replacement: `${libRoot}/` },
				{ find: /^\$convex\//, replacement: `${convexRoot}/` },
				{ find: /^\$core\//, replacement: `${coreRoot}/` },
			],
		},
	},
});
