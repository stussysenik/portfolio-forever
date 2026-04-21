import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "post",
	title: "Post",
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
			name: "publishedAt",
			title: "Published At",
			type: "datetime",
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "mainImage",
			title: "Main Image",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [
				defineArrayMember({ type: "block" }),
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
				}),
			],
		}),
	],
});
