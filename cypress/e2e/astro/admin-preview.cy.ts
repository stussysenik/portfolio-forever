describe("admin preview loop", () => {
	it("routes editorial preview back into the Astro host", () => {
		cy.visit("/admin/content");
		cy.contains("Tighter preview starts here").should("be.visible");
		cy.contains("a", "Preview homepage").should(
			"have.attr",
			"href",
			"/?preview=1&document=heroContent",
		);

		cy.visit("/?preview=1&document=heroContent");
		cy.get('[data-testid="preview-ribbon"]').should("be.visible");
	});
});
