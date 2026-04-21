import { defineLocations } from "sanity/presentation";

export const presentationLocations = {
	heroContent: defineLocations({
		select: {
			title: "headline",
		},
		resolve: (document) => {
			if (!document) {
				return null;
			}

			return {
				locations: [
					{
						title: document.title || "Homepage hero",
						href: "/?preview=1&document=heroContent",
					},
					{
						title: "Process framing",
						href: "/process?preview=1&document=heroContent",
					},
				],
			};
		},
	}),
	profile: defineLocations({
		select: {
			title: "name",
		},
		resolve: (document) => {
			if (!document) {
				return null;
			}

			return {
				locations: [
					{
						title: document.title || "Profile",
						href: "/cv?preview=1&document=profile",
					},
				],
			};
		},
	}),
	caseStudy: defineLocations({
		select: {
			title: "title",
		},
		resolve: (document) => {
			if (!document) {
				return null;
			}

			return {
				locations: [
					{
						title: document.title || "Case study",
						href: "/works?preview=1&document=caseStudy",
					},
				],
			};
		},
	}),
	post: defineLocations({
		select: {
			title: "title",
			slug: "slug.current",
		},
		resolve: (document) => {
			if (!document) {
				return null;
			}

			const slug = typeof document.slug === "string" ? document.slug : "";
			const href = slug ? `/blog/${slug}?preview=1&document=post` : "/blog?preview=1&document=post";

			return {
				locations: [
					{
						title: document.title || "Blog post",
						href,
					},
				],
			};
		},
	}),
};
