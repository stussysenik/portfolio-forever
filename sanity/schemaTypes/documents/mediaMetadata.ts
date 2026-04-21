import { defineField, defineType } from "sanity";

export default defineType({
	name: "mediaMetadata",
	title: "Media Metadata",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "asset",
			title: "Asset",
			type: "file",
		}),
		defineField({
			name: "alt",
			title: "Alt Text",
			type: "string",
		}),
		defineField({
			name: "caption",
			title: "Caption",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "credit",
			title: "Credit",
			type: "string",
		}),
	],
});
