import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "profile",
	title: "Profile",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
		}),
		defineField({
			name: "location",
			title: "Location",
			type: "string",
		}),
		defineField({
			name: "shortBio",
			title: "Short Bio",
			type: "text",
			rows: 5,
		}),
		defineField({
			name: "links",
			title: "Links",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({ name: "label", title: "Label", type: "string" }),
						defineField({ name: "href", title: "Href", type: "url" }),
					],
				}),
			],
		}),
	],
});
