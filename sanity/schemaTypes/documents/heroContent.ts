import { defineField, defineType } from "sanity";

export default defineType({
	name: "heroContent",
	title: "Hero Content",
	type: "document",
	fields: [
		defineField({
			name: "headline",
			title: "Headline",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "subheadline",
			title: "Subheadline",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "ctaLabel",
			title: "CTA Label",
			type: "string",
		}),
		defineField({
			name: "ctaHref",
			title: "CTA Href",
			type: "string",
		}),
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
		}),
	],
});
