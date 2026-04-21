import { expect, test } from "@playwright/test";
import { buildPreviewHref } from "../../src/lib/astro/preview";

const previewRoutes = [
	{
		route: "/",
		document: "heroContent",
		selector: '[data-testid="hero-grid"]',
	},
	{
		route: "/works",
		document: "caseStudy",
		selector: '[data-testid="colored-works"]',
	},
	{
		route: "/cv",
		document: "profile",
		selector: '[data-testid="cv-timeline"]',
	},
	{
		route: "/process",
		document: "heroContent",
		selector: '[data-testid="process-diagram"]',
	},
	{
		route: "/blog",
		document: "post",
		selector: '[data-testid="blog-list"]',
	},
] as const;

test("Sanity preview routes keep their Astro rendering and editorial handoff", async ({ page }) => {
	for (const entry of previewRoutes) {
		await page.goto(buildPreviewHref(entry.route, entry.document));
		await expect(page.getByTestId("preview-ribbon")).toBeVisible();
		await expect(page.locator(entry.selector)).toBeVisible();
		await expect(page.getByRole("link", { name: "Open `/admin/content`" })).toHaveAttribute(
			"href",
			`/admin/content?document=${entry.document}`,
		);
		await expect(page.getByRole("link", { name: /^Edit / })).toHaveAttribute(
			"href",
			`/admin/content?document=${entry.document}`,
		);
	}
});

test("admin system mutations propagate into the Astro public shell", async ({ browser }) => {
	const context = await browser.newContext();
	const publicPage = await context.newPage();
	const adminPage = await context.newPage();

	await publicPage.addInitScript(() => {
		window.localStorage.removeItem("wipBannerDismissed");
	});

	await publicPage.goto("/");
	await adminPage.goto("/admin/system?bypassAuth=1");

	await expect(adminPage.getByTestId("admin-system-app")).toBeVisible();
	await expect(adminPage.getByTestId("admin-auth-bypass")).toBeVisible();
	await expect(adminPage.getByTestId("system-page-home")).toBeVisible();

	const previewFrame = adminPage.frameLocator('[data-testid="system-preview-iframe"]');
	const flagButton = adminPage.getByTestId("system-flag-wip-banner").getByRole("button");
	const initialState = ((await flagButton.textContent()) ?? "Off").trim();
	const toggledState = initialState === "On" ? "Off" : "On";

	await flagButton.click();
	await expect(flagButton).toHaveText(toggledState);

	if (toggledState === "On") {
		await expect(publicPage.getByTestId("public-wip-banner")).toBeVisible();
		await expect(previewFrame.getByTestId("public-wip-banner")).toBeVisible();
	} else {
		await expect(publicPage.getByTestId("public-wip-banner")).toHaveCount(0);
		await expect(previewFrame.getByTestId("public-wip-banner")).toHaveCount(0);
	}

	await flagButton.click();
	await expect(flagButton).toHaveText(initialState);

	if (initialState === "On") {
		await expect(publicPage.getByTestId("public-wip-banner")).toBeVisible();
		await expect(previewFrame.getByTestId("public-wip-banner")).toBeVisible();
	} else {
		await expect(publicPage.getByTestId("public-wip-banner")).toHaveCount(0);
		await expect(previewFrame.getByTestId("public-wip-banner")).toHaveCount(0);
	}

	await adminPage.getByRole("button", { name: "one-page" }).click();
	await expect(publicPage.locator("html")).toHaveAttribute("data-site-mode", "one-page");
	await expect(previewFrame.locator("html")).toHaveAttribute("data-site-mode", "one-page");

	await adminPage.getByRole("button", { name: "multi-page" }).click();
	await expect(publicPage.locator("html")).toHaveAttribute("data-site-mode", "multi-page");
	await expect(previewFrame.locator("html")).toHaveAttribute("data-site-mode", "multi-page");

	await adminPage.getByTestId("system-page-process").click();
	const visibilityButton = adminPage.getByRole("button", { name: "Hide page" });
	const publicNav = publicPage.getByTestId("public-nav");
	const previewNav = previewFrame.getByTestId("public-nav");

	await visibilityButton.click();
	await expect(adminPage.getByRole("button", { name: "Publish page" })).toBeVisible();
	await expect(publicNav.getByRole("link", { name: "Process" })).toHaveCount(0);
	await expect(previewNav.getByRole("link", { name: "Process" })).toHaveCount(0);

	await adminPage.getByRole("button", { name: "Publish page" }).click();
	await expect(adminPage.getByRole("button", { name: "Hide page" })).toBeVisible();
	await expect(publicNav.getByRole("link", { name: "Process" })).toBeVisible();
	await expect(previewNav.getByRole("link", { name: "Process" })).toBeVisible();

	await context.close();
});
