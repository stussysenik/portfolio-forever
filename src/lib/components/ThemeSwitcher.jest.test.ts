import { describe, it, expect, beforeEach } from '@jest/globals';

type Theme = 'minimal' | 'studio' | 'terminal' | 'bw';

const themes: { id: Theme; label: string; icon: string; description: string }[] = [
	{ id: 'minimal',  label: 'Minimal',  icon: '○', description: 'Warm & colorful' },
	{ id: 'studio',   label: 'Studio',   icon: '◇', description: 'Achromatic precision' },
	{ id: 'terminal', label: 'Terminal', icon: '▸', description: 'Hacker dark' },
	{ id: 'bw',       label: 'B&W',      icon: '⋎', description: 'Ink & craft' },
];

function createThemeSwitcherState() {
	let currentTheme: Theme = 'minimal';
	let isOpen = false;
	const events: { type: string; theme?: Theme; isOpen?: boolean }[] = [];

	function applyTheme(theme: Theme, announce: boolean = true) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		currentTheme = theme;
		if (announce) events.push({ type: 'theme-changed', theme });
	}

	function init() {
		const saved = localStorage.getItem('theme');
		if (saved === 'paper') {
			currentTheme = 'minimal';
			applyTheme('minimal', false);
		} else if (saved === 'accessible' || saved === 'sumi') {
			currentTheme = 'bw';
			applyTheme('bw', false);
		} else if (saved && themes.some(t => t.id === saved)) {
			currentTheme = saved as Theme;
			applyTheme(saved as Theme, false);
		} else {
			applyTheme('minimal', false);
		}
	}

	function toggleDropdown() {
		isOpen = !isOpen;
		events.push({ type: 'toggle', isOpen });
	}

	function selectTheme(theme: Theme) {
		applyTheme(theme);
		isOpen = false;
		events.push({ type: 'select', theme, isOpen });
	}

	function closeDropdown() {
		isOpen = false;
		events.push({ type: 'close', isOpen });
	}

	return {
		get currentTheme() { return currentTheme; },
		get isOpen() { return isOpen; },
		get events() { return events; },
		init,
		toggleDropdown,
		selectTheme,
		closeDropdown,
	};
}

describe('ThemeSwitcher — show theme dropdown on click [Jest]', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('clicking toggle opens dropdown without changing theme', () => {
		const state = createThemeSwitcherState();
		state.init();

		const themeBefore = state.currentTheme;
		expect(state.isOpen).toBe(false);

		state.toggleDropdown();

		expect(state.isOpen).toBe(true);
		expect(state.currentTheme).toBe(themeBefore);
		expect(document.documentElement.getAttribute('data-theme')).toBe(themeBefore);
	});

	it('clicking toggle again closes dropdown without changing theme', () => {
		const state = createThemeSwitcherState();
		state.init();

		const themeBefore = state.currentTheme;
		state.toggleDropdown();
		expect(state.isOpen).toBe(true);

		state.toggleDropdown();
		expect(state.isOpen).toBe(false);
		expect(state.currentTheme).toBe(themeBefore);
	});

	it('selecting a theme changes the theme and closes the dropdown', () => {
		const state = createThemeSwitcherState();
		state.init();

		state.toggleDropdown();
		state.selectTheme('terminal');

		expect(state.currentTheme).toBe('terminal');
		expect(state.isOpen).toBe(false);
		expect(document.documentElement.getAttribute('data-theme')).toBe('terminal');
	});

	it('closing the dropdown does not change the theme', () => {
		const state = createThemeSwitcherState();
		state.init();
		state.toggleDropdown();

		const themeBefore = state.currentTheme;
		state.closeDropdown();

		expect(state.isOpen).toBe(false);
		expect(state.currentTheme).toBe(themeBefore);
	});

	it('toggle emits only toggle events, never theme-changed events', () => {
		const state = createThemeSwitcherState();
		state.init();

		state.toggleDropdown();
		state.toggleDropdown();
		state.toggleDropdown();

		const themeChangeEvents = state.events.filter(e => e.type === 'theme-changed');
		expect(themeChangeEvents).toHaveLength(0);

		const toggleEvents = state.events.filter(e => e.type === 'toggle');
		expect(toggleEvents).toHaveLength(3);
	});

	it('maps legacy theme "paper" to "minimal"', () => {
		localStorage.setItem('theme', 'paper');
		const state = createThemeSwitcherState();
		state.init();
		expect(state.currentTheme).toBe('minimal');
	});

	it('maps legacy themes "accessible" and "sumi" to "bw"', () => {
		localStorage.setItem('theme', 'accessible');
		const state1 = createThemeSwitcherState();
		state1.init();
		expect(state1.currentTheme).toBe('bw');

		localStorage.setItem('theme', 'sumi');
		const state2 = createThemeSwitcherState();
		state2.init();
		expect(state2.currentTheme).toBe('bw');
	});

	it('defaults to "minimal" for unknown stored themes', () => {
		localStorage.setItem('theme', 'nonexistent');
		const state = createThemeSwitcherState();
		state.init();
		expect(state.currentTheme).toBe('minimal');
	});
});
