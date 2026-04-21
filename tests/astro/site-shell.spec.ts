import { expect, test } from "@playwright/test";

test("homepage exposes the Astro hero, works, and embeds", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByTestId("hero-grid")).toBeVisible();
	await expect(page.getByTestId("hero-grid").getByRole("heading", { level: 1 })).toBeVisible();
	await expect(page.getByTestId("colored-works")).toBeVisible();
	await expect(page.getByTestId("live-embedded-works").locator("iframe")).toHaveCount(3);
});

test("admin editorial lane exposes preview links and studio entry", async ({ page }) => {
	await page.goto("/admin/content");

	await expect(page.getByRole("heading", { name: "Tighter preview starts here" })).toBeVisible();
	await expect(page.getByTestId("admin-preview-links")).toBeVisible();
	await expect(page.getByRole("link", { name: "Open embedded Studio" })).toHaveAttribute(
		"href",
		"/admin/content/studio",
	);
	await expect(page.getByRole("link", { name: "Preview homepage" })).toHaveAttribute(
		"href",
		"/?preview=1&document=heroContent",
	);
});

test("admin system lane requires auth before mounting live controls", async ({ page }) => {
	await page.goto("/admin/system");

	await expect(page.getByRole("heading", { name: "Convex remains the live layer." })).toBeVisible();
	await expect(page.getByTestId("admin-auth-gate")).toBeVisible();
	await expect(page.getByTestId("admin-system-app")).toHaveCount(0);
});

test("preview mode is reflected on public pages", async ({ page }) => {
	await page.goto("/cv?preview=1&document=profile");

	await expect(page.getByTestId("preview-ribbon")).toBeVisible();
	await expect(page.getByRole("link", { name: "Edit profile" })).toHaveAttribute(
		"href",
		"/admin/content?document=profile",
	);
	await expect(page.getByTestId("cv-timeline")).toBeVisible();
});

test("preview handoff keeps document context inside the editorial lane", async ({ page }) => {
	await page.goto("/admin/content?document=profile");

	const handoff = page.getByTestId("editorial-handoff");
	await expect(handoff).toBeVisible();
	await expect(handoff.getByRole("link", { name: /studio/i }).first()).toHaveAttribute(
		"href",
		/\/admin\/content\/studio/,
	);
});

test("blog index and article routes render from the Astro host", async ({ page }) => {
	await page.goto("/blog");

	await expect(page.getByTestId("blog-list")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Editorial notes that stay close to the actual system." })).toBeVisible();

	await page.goto("/blog/tighter-preview-loop");

	await expect(page.getByTestId("blog-article")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Designing a tighter preview loop for editorial work" })).toBeVisible();
});

test("Astro serves the remaining legacy public routes through hydrated Svelte sections", async ({ page }) => {
	const routeMatrix = [
		{ route: "/academia", text: "Re:mix Research" },
		{ route: "/gallery", text: "GALLERY" },
		{ route: "/gifts", text: "Send books, postcards, or art supplies" },
		{ route: "/labs", text: "Experiments & Labs" },
		{ route: "/likes", text: "THINGS I LIKE" },
		{ route: "/media", text: "MEDIA" },
		{ route: "/minor", text: "MINOR" },
		{ route: "/os", text: "Welcome.txt" },
		{ route: "/scratchpad", text: "SCRATCHPAD" },
		{ route: "/talks", text: "TALKS" },
		{ route: "/terminal", text: "Portfolio Terminal" },
	];

	for (const entry of routeMatrix) {
		await page.goto(entry.route);
		await expect(page.getByTestId("site-header")).toBeVisible();
		await expect(page.getByText(entry.text, { exact: false }).first()).toBeVisible();
	}
});
