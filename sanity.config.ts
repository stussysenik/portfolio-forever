import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./sanity/schemaTypes";
import { presentationLocations } from "./sanity/presentation/resolve";

const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:4321";

export default defineConfig({
	name: "portfolio-editorial",
	title: "Portfolio Editorial",
	projectId: process.env.VITE_SANITY_PROJECT_ID ?? "py21y2h1",
	dataset: process.env.VITE_SANITY_DATASET ?? "production",
	plugins: [
		structureTool(),
		visionTool(),
		presentationTool({
			previewUrl: {
				initial: previewOrigin,
				previewMode: {
					enable: "/api/draft-mode/enable",
					disable: "/api/draft-mode/disable",
				},
			},
			allowOrigins: ["http://localhost:*", "http://127.0.0.1:*"],
			resolve: {
				locations: presentationLocations,
			},
		}),
	],
	schema: {
		types: schemaTypes,
	},
});
