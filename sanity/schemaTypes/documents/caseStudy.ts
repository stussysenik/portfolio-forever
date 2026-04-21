import { defineField, defineType } from "sanity";

export default defineType({
	name: "caseStudy",
	title: "Case Study",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "summary",
			title: "Summary",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "year",
			title: "Year",
			type: "number",
		}),
		defineField({
			name: "coverImage",
			title: "Cover Image",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [{ type: "block" }],
		}),
	],
});
