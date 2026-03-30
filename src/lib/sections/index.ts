export interface SectionMeta {
	id: string;
	label: string;
	route: string;
}

export const sections: SectionMeta[] = [
	{ id: "hero", label: "Home", route: "/" },
	{ id: "works", label: "Works", route: "/works" },
	{ id: "talks", label: "Talks", route: "/talks" },
	{ id: "terminal", label: "Terminal", route: "/terminal" },
	{ id: "cv", label: "CV", route: "/cv" },
	{ id: "academia", label: "Re:mix", route: "/academia" },
	{ id: "blog", label: "Blog", route: "/blog" },
	{ id: "process", label: "Process", route: "/process" },
	{ id: "gallery", label: "Gallery", route: "/gallery" },
	{ id: "likes", label: "Likes", route: "/likes" },
	{ id: "minor", label: "Minor", route: "/minor" },
	{ id: "gifts", label: "Gifts", route: "/gifts" },
	{ id: "os", label: "OS", route: "/os" },
];

