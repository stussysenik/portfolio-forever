/// <reference types="cypress" />

describe('show theme dropdown on click', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.get('html').should('have.attr', 'data-theme');
		cy.get('.theme-toggle').should('be.visible');
	});

	it('clicking theme-toggle shows only the theme-dropdown and does not change the active theme', () => {
		let initialTheme = '';

		cy.get('html').invoke('attr', 'data-theme').then(theme => {
			initialTheme = theme ?? '';
		});

		cy.get('.theme-dropdown').should('not.be.visible');
		cy.get('.font-dropdown').should('not.be.visible');

		cy.get('.theme-toggle').click();

		cy.get('.theme-dropdown').should('be.visible');
		cy.get('.font-dropdown').should('not.be.visible');

		cy.get('html').invoke('attr', 'data-theme').should('equal', initialTheme);
	});

	it('clicking theme-toggle again closes the theme-dropdown', () => {
		cy.get('.theme-toggle').click();
		cy.get('.theme-dropdown').should('be.visible');

		cy.get('.theme-toggle').click();
		cy.get('.theme-dropdown').should('not.be.visible');
	});

	it('clicking theme-toggle while font-dropdown is open closes font-dropdown', () => {
		cy.get('.font-toggle').click();
		cy.get('.font-dropdown').should('be.visible');

		cy.get('.theme-toggle').click();
		cy.get('.theme-dropdown').should('be.visible');
		cy.get('.font-dropdown').should('not.be.visible');
	});

	it('clicking outside the theme-dropdown closes it', () => {
		cy.get('.theme-toggle').click();
		cy.get('.theme-dropdown').should('be.visible');

		cy.get('main').click(10, 10);
		cy.get('.theme-dropdown').should('not.be.visible');
	});

	it('pressing Escape closes the theme-dropdown without changing the theme', () => {
		let initialTheme = '';

		cy.get('html').invoke('attr', 'data-theme').then(theme => {
			initialTheme = theme ?? '';
		});

		cy.get('.theme-toggle').click();
		cy.get('.theme-dropdown').should('be.visible');

		cy.get('body').type('{esc}');
		cy.get('.theme-dropdown').should('not.be.visible');

		cy.get('html').invoke('attr', 'data-theme').should('equal', initialTheme);
	});

	it('selecting a theme changes data-theme and closes the dropdown', () => {
		let initialTheme = '';

		cy.get('html').invoke('attr', 'data-theme').then(theme => {
			initialTheme = theme ?? '';
		});

		cy.get('.theme-toggle').click();
		cy.get('.theme-dropdown').should('be.visible');

		const target = initialTheme === 'studio' ? 'terminal' : 'studio';
		cy.get(`.theme-option[data-theme="${target}"]`).click();
		cy.get('html').should('have.attr', 'data-theme', target);

		cy.get('.theme-dropdown').should('not.be.visible');
		cy.get('.font-dropdown').should('not.be.visible');
	});
});
