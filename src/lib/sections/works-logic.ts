/**
 * Works section logic — handles project transformations and view modes.
 * Ported from clj/portfolio/sections/works.cljs
 */
import { api } from "$lib/app-shims";

export function useStaticPreview(project: any) {
	return (
		project.previewMode === "static" || (project.preview && !project.videoPreview)
	);
}

export function useVideoPreview(project: any) {
	return project.previewMode === "video" || (project.videoPreview && project.preview);
}

export function getObjectPosition(project: any) {
	return (
		project.objectPosition ||
		(project.focalX && project.focalY
			? `${project.focalX}% ${project.focalY}%`
			: "center top")
	);
}

export function getZoomStyle(project: any) {
	if (project.zoom) {
		return `transform: scale(${project.zoom}); transform-origin: ${getObjectPosition(
			project
		)};`;
	}
	return "";
}

export function overrideVars(project: any) {
	const o = project.styleOverrides || {};
	return [
		o.accentColor && `--works-stripe-color: ${o.accentColor}`,
		o.httpColor && `--works-http-color: ${o.httpColor}`,
		o.secondaryHighlight && `--works-secondary-highlight: ${o.secondaryHighlight}`,
	]
		.filter(Boolean)
		.join("; ");
}

export const colorMap: Record<string, string> = {
	orange: "#F97242",
	cloud: "#EBEBEB",
	ocean: "#BAF1F9",
	gold: "#DAB230",
	pink: "#FFC0CB",
	"electric-green": "#39FF14",
	green: "#4CAF50",
	yellow: "#FFEB3B",
	red: "#F44336",
};

export function getRowStyle(work: any) {
	const featured = work.featured;
	const styleOverrides = work.styleOverrides;

	if (featured && colorMap[featured]) {
		return `--row-bg: ${colorMap[featured]}`;
	}
	if (styleOverrides && styleOverrides.accentColor) {
		return `--row-bg: ${styleOverrides.accentColor}`;
	}
	return "";
}

export function formatWorkDate(work: any) {
	const y = work.year;
	const m = work.month;
	if (y && m) {
		return `${y}.${m.toString().padStart(2, "0")}`;
	}
	return y || "";
}

export function getWorksHiccup(
	projects: any[],
	_displayMode: string,
	_gridCols: number,
	_showPreview: boolean,
	_viewMode: string,
	isScreenPass: boolean
) {
	const visibleProjects = isScreenPass ? projects.slice(0, 11) : projects;

	const children = visibleProjects.map((p) => [
		"a",
		{
			href: p.url,
			target: "_blank",
			class: "work-row",
			style: getRowStyle(p),
		},
		["span", { class: "work-date" }, formatWorkDate(p)],
		["span", { class: "work-title" }, p.title],
		["span", { class: "work-link" }, "visit"],
	]);

	return [
		"section",
		{ class: "works-list-container", id: "works" },
		[
			"header",
			{ class: "table-header" },
			["span", { class: "table-marker" }, "◆"],
			["h2", { class: "table-title" }, "WORKS"],
			["span", { class: "table-count" }, `[${projects.length}]`],
		],
		["div", { class: "works-list" }, ...children],
	];
}

export function setupWorksSubscriptions(client: any, callbacks: any) {
	const { onWorks, onThumbnails, onSection } = callbacks;

	const unsubWorks = client.onUpdate(
		api.works.getVisibleWorks,
		{},
		(data: any) => {
			if (onWorks) onWorks(data);
		}
	);
	const unsubThumbnails = client.onUpdate(
		api.thumbnails.getConfig,
		{ section: "works" },
		(data: any) => {
			if (onThumbnails) onThumbnails(data);
		}
	);
	const unsubSection = client.onUpdate(
		api.sectionRegistry.getBySectionId,
		{ sectionId: "works" },
		(data: any) => {
			if (onSection) onSection(data);
		}
	);

	return () => {
		unsubWorks();
		unsubThumbnails();
		unsubSection();
	};
}
