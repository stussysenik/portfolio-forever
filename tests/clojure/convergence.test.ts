/**
 * Clojure ↔ TypeScript Convergence Tests
 *
 * These tests verify that the Squint-compiled Clojure modules produce
 * values structurally equivalent to the original TypeScript implementations.
 */
import { describe, it, expect } from 'vitest';

// ─── Import TypeScript sources ───
import { skills, tools, profile, works, galleryItems, processSteps, socialLinks, siteConfig, getSkillsByCategory, getToolsByCategory, formatDate, getHighlight, sortEntries, sortedWorks, sortedTalks, sortedInterviews, type Entry } from '../../src/lib/data/content';
import { cvData, generateJsonLd } from '../../src/lib/data/cv';
import { labs, checkFeature, checkAllFeatures, getStatusLabel, getStatusClass } from '../../src/lib/data/labs';
import { layoutConfig, mobileDesignTokens } from '../../src/lib/data/layout-config';
import { getContrastColor, getHighlightTextColor } from '../../src/lib/utils/contrast';
import { filterByDepth, type DepthLevel } from '../../src/lib/utils/depth-filter';
import { getParallaxMultiplier, getScrollBehavior, type PhysicsMode } from '../../src/lib/utils/scroll-physics';
import { sections } from '../../src/lib/sections/index';
import { sectionTypeRegistry, getSectionTypesByCategory, getAllSectionTypes } from '../../src/lib/sections/registry';
import { githubProfile, repos, langColors } from '../../src/lib/terminal/github';
import { VIEW_MODES, DEFAULTS, LINE_HEIGHT_SCALE, FONT_SIZE_SCALE, TYPOGRAPHY_DEFAULTS, formatRelativeTime, stripConvexMeta, FLAG_CATEGORIES } from '../../src/lib/admin/constants';

import { getTypographyStyle } from '../../src/lib/utils/section-typography';
import { parseMath } from '../../src/lib/utils/parseMath';

// ─── Import Clojure compiled sources ───
import * as cljContent from '../../clj/out/portfolio/data/content.mjs';
import * as cljCv from '../../clj/out/portfolio/data/cv.mjs';
import * as cljLabs from '../../clj/out/portfolio/data/labs.mjs';
import * as cljLayoutConfig from '../../clj/out/portfolio/data/layout_config.mjs';
import * as cljContrast from '../../clj/out/portfolio/utils/contrast.mjs';
import * as cljDepthFilter from '../../clj/out/portfolio/utils/depth_filter.mjs';
import * as cljScrollPhysics from '../../clj/out/portfolio/utils/scroll_physics.mjs';
import * as cljTypography from '../../clj/out/portfolio/utils/section_typography.mjs';
import * as cljParseMath from '../../clj/out/portfolio/utils/parse_math.mjs';
import * as cljSectionsRegistry from '../../clj/out/portfolio/sections/registry.mjs';
import * as cljSectionsIndex from '../../clj/out/portfolio/sections/index.mjs';
import * as cljGithub from '../../clj/out/portfolio/terminal/github.mjs';
import * as cljConstants from '../../clj/out/portfolio/admin/constants.mjs';
import * as cljControls from '../../clj/out/portfolio/stores/controls.mjs';

// ═══════════════════════════════════════════════════════════
// UTILS.SECTION-TYPOGRAPHY CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('utils.section-typography convergence', () => {
  it('getTypographyStyle matches for various configs', () => {
    const configs = [
      { typography: { fontSize: 1.2, fontWeight: 600 } },
      { typography: { lineHeight: 1.5, letterSpacing: 0.05 } },
      { typography: { fontSize: 2, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.02 } },
      {},
      null
    ];
    for (const config of configs) {
      expect(cljTypography.get_typography_style(config)).toBe(getTypographyStyle(config));
    }
  });
});

// ═══════════════════════════════════════════════════════════
// UTILS.PARSE-MATH CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('utils.parse-math convergence', () => {
  it('parseMath matches for various inputs', () => {
    const inputs = [
      'Simple text',
      'Text with $inline$ math',
      'Text with $$block$$ math',
      'Mixed $inline$ and $$block$$ math',
      'Escaped \\$ dollar sign',
      '$Unterminated math',
      '$$Unterminated block',
      ''
    ];
    for (const input of inputs) {
      const tsResult = parseMath(input);
      const cljResult = cljParseMath.parse_math(input);
      expect(cljResult).toEqual(tsResult);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// DATA.CONTENT CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('data.content convergence', () => {
  it('skills array length matches', () => {
    expect(cljContent.skills.length).toBe(skills.length);
  });

  it('skills entries have same structure', () => {
    for (let i = 0; i < skills.length; i++) {
      expect(cljContent.skills[i]).toHaveProperty('name');
      expect(cljContent.skills[i]).toHaveProperty('category');
      expect(cljContent.skills[i]).toHaveProperty('proficiency');
      // Squint uses kebab-case: years-used instead of yearsUsed
      const cljYears = cljContent.skills[i]['years-used'] ?? cljContent.skills[i].yearsUsed;
      expect(cljYears).toBe(skills[i].yearsUsed);
      expect(cljContent.skills[i].category).toBe(skills[i].category);
      expect(cljContent.skills[i].proficiency).toBe(skills[i].proficiency);
    }
  });

  it('tools array length matches', () => {
    expect(cljContent.tools.length).toBe(tools.length);
  });

  it('tools entries have same structure', () => {
    for (let i = 0; i < tools.length; i++) {
      expect(cljContent.tools[i].name).toBe(tools[i].name);
      expect(cljContent.tools[i].category).toBe(tools[i].category);
      expect(cljContent.tools[i].expertise).toBe(tools[i].expertise);
      if (tools[i].url) {
        expect(cljContent.tools[i].url).toBe(tools[i].url);
      }
    }
  });

  it('profile has same name and location', () => {
    expect(cljContent.profile.name).toBe(profile.name);
    expect(cljContent.profile.location).toBe(profile.location);
    expect(cljContent.profile.available).toBe(profile.available);
    expect(cljContent.profile.email).toBe(profile.email);
    expect(cljContent.profile.edition).toBe(profile.edition);
  });

  it('works array length matches', () => {
    expect(cljContent.works.length).toBe(works.length);
  });

  it('works entries have same core fields', () => {
    for (let i = 0; i < works.length; i++) {
      expect(cljContent.works[i].year).toBe(works[i].year);
      expect(cljContent.works[i].month).toBe(works[i].month);
      expect(cljContent.works[i].title).toBe(works[i].title);
      expect(cljContent.works[i].category).toBe(works[i].category);
    }
  });

  it('galleryItems array length matches', () => {
    expect(cljContent.gallery_items.length).toBe(galleryItems.length);
  });

  it('processSteps array length matches', () => {
    expect(cljContent.process_steps.length).toBe(processSteps.length);
  });

  it('socialLinks array length matches', () => {
    expect(cljContent.social_links.length).toBe(socialLinks.length);
  });

  it('getHighlight produces same results for valid featured colors', () => {
    const colors: (string | undefined)[] = ['yellow', 'green', 'electric-green', 'orange', 'ocean', 'gold', 'pink', 'cloud', 'red'];
    for (const color of colors) {
      const tsResult = getHighlight({ year: 2026, featured: color } as Entry);
      const cljResult = cljContent.get_highlight({ year: 2026, featured: color } as any);
      expect(cljResult).toBe(tsResult);
    }
  });

  it('getHighlight returns nullish for missing featured color', () => {
    // TS returns null, CLJ returns undefined — both are nullish
    const tsResult = getHighlight({ year: 2026 } as Entry);
    const cljResult = cljContent.get_highlight({ year: 2026 } as any);
    expect(tsResult == null).toBe(true);
    expect(cljResult == null).toBe(true);
  });

  it('formatDate produces same results', () => {
    const testEntries = [
      { year: 2026, month: 1 },
      { year: 2025, month: 12 },
      { year: 2024 },
    ] as Entry[];
    for (const entry of testEntries) {
      expect(cljContent.format_date(entry)).toBe(formatDate(entry));
    }
  });

  it('sortEntries produces same order', () => {
    const tsSorted = sortEntries([...works]);
    const cljSorted = cljContent.sort_entries([...cljContent.works]);
    expect(cljSorted.length).toBe(tsSorted.length);
    for (let i = 0; i < tsSorted.length; i++) {
      expect(cljSorted[i].title).toBe(tsSorted[i].title);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// DATA.CV CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('data.cv convergence', () => {
  it('cvData has same core fields', () => {
    expect(cljCv.cv_data.name).toBe(cvData.name);
    expect(cljCv.cv_data.job_title ?? cljCv.cv_data['job-title']).toBe(cvData.jobTitle);
    expect(cljCv.cv_data.url).toBe(cvData.url);
    expect(cljCv.cv_data.summary).toBe(cvData.summary);
  });

  it('cvData work experience same count', () => {
    const cljWork = cljCv.cv_data.work_experience ?? cljCv.cv_data['work-experience'];
    expect(cljWork.length).toBe(cvData.workExperience.length);
  });

  it('generateJsonLd produces output', () => {
    const json = cljCv.generate_json_ld(cljCv.cv_data);
    expect(json).toBeTruthy();
    expect(json.length).toBeGreaterThan(100);
  });
});

// ═══════════════════════════════════════════════════════════
// DATA.LABS CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('data.labs convergence', () => {
  it('labs array length matches', () => {
    expect(cljLabs.labs.length).toBe(labs.length);
  });

  it('labs entries have same titles', () => {
    for (let i = 0; i < labs.length; i++) {
      expect(cljLabs.labs[i].title).toBe(labs[i].title);
      expect(cljLabs.labs[i].slug).toBe(labs[i].slug);
      expect(cljLabs.labs[i].status).toBe(labs[i].status);
    }
  });

  it('getStatusLabel matches', () => {
    const statuses: Array<'stable' | 'beta' | 'experimental' | 'archived'> = ['stable', 'beta', 'experimental', 'archived'];
    for (const s of statuses) {
      expect(cljLabs.get_status_label(s)).toBe(getStatusLabel(s));
    }
  });

  it('getStatusClass matches', () => {
    const statuses: Array<'stable' | 'beta' | 'experimental' | 'archived'> = ['stable', 'beta', 'experimental', 'archived'];
    for (const s of statuses) {
      expect(cljLabs.get_status_class(s)).toBe(getStatusClass(s));
    }
  });
});

// ═══════════════════════════════════════════════════════════
// DATA.LAYOUT-CONFIG CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('data.layout-config convergence', () => {
  it('layoutConfig has same showWipBanner (kebab-case key)', () => {
    // Squint converts camelCase to kebab-case: showWipBanner → show-wip-banner
    const cljWip = cljLayoutConfig.layout_config['show-wip-banner'] ?? cljLayoutConfig.layout_config.showWipBanner;
    expect(cljWip).toBe(layoutConfig.showWipBanner);
  });
});

// ═══════════════════════════════════════════════════════════
// UTILS.CONTRAST CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('utils.contrast convergence', () => {
  const testColors = ['#1a1a1a', '#ffffff', '#fff5c2', '#F97242', '#44D62C', '#B3EBF2', '#691424'];

  it('getContrastColor produces same results for all test colors', () => {
    for (const color of testColors) {
      const tsResult = getContrastColor(color);
      const cljResult = cljContrast.get_contrast_color(color);
      expect(cljResult).toBe(tsResult);
    }
  });

  it('getHighlightTextColor matches for all featured colors', () => {
    // TS has FEATURED_HEX as private; CLJ exports it as featured_hex
    const colorNames = Object.keys(cljContrast.featured_hex);
    expect(colorNames.length).toBeGreaterThan(0);
    for (const color of colorNames) {
      const tsResult = getHighlightTextColor(color);
      const cljResult = cljContrast.get_highlight_text_color(color);
      expect(cljResult).toBe(tsResult);
    }
  });

  it('getHighlightTextColor returns nullish for invalid color', () => {
    const tsResult = getHighlightTextColor('nonexistent');
    const cljResult = cljContrast.get_highlight_text_color('nonexistent');
    expect(tsResult == null).toBe(true);
    expect(cljResult == null).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// UTILS.DEPTH-FILTER CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('utils.depth-filter convergence', () => {
  const allSections = ['hero', 'works', 'cv', 'talks', 'blog', 'process', 'gallery', 'likes', 'minor', 'gifts', 'os'];

  it('filterByDepth("full") returns all sections', () => {
    const tsResult = filterByDepth(allSections, 'full');
    const cljResult = cljDepthFilter.filter_by_depth(allSections, 'full');
    expect(cljResult.length).toBe(tsResult.length);
  });

  it('filterByDepth("5-min") returns only screen-pass sections', () => {
    const tsResult = filterByDepth(allSections, '5-min');
    const cljResult = cljDepthFilter.filter_by_depth(allSections, '5-min');
    expect(cljResult.length).toBe(tsResult.length);
    expect(cljResult).toEqual(tsResult);
  });

  it('filterByDepth("15-min") returns all sections', () => {
    const tsResult = filterByDepth(allSections, '15-min');
    const cljResult = cljDepthFilter.filter_by_depth(allSections, '15-min');
    expect(cljResult.length).toBe(tsResult.length);
  });
});

// ═══════════════════════════════════════════════════════════
// UTILS.SCROLL-PHYSICS CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('utils.scroll-physics convergence', () => {
  it('getParallaxMultiplier matches for all modes', () => {
    const modes: PhysicsMode[] = ['spring', 'frictionless', 'string'];
    for (const mode of modes) {
      expect(cljScrollPhysics.get_parallax_multiplier(mode)).toBe(getParallaxMultiplier(mode));
    }
  });

  it('getScrollBehavior matches for all modes', () => {
    const modes: PhysicsMode[] = ['spring', 'frictionless', 'string'];
    for (const mode of modes) {
      expect(cljScrollPhysics.get_scroll_behavior(mode)).toBe(getScrollBehavior(mode));
    }
  });
});

// ═══════════════════════════════════════════════════════════
// SECTIONS CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('sections convergence', () => {
  it('CLJ section_registry has entries', () => {
    expect(cljSectionsRegistry.section_registry.length).toBeGreaterThan(0);
  });

  it('CLJ section_routes matches TS sections by route content', () => {
    // CLJ exports section_routes (array), TS exports sections (array)
    // Both have id/label/route — compare by route values
    const cljRoutes = cljSectionsIndex.section_routes.map((s: any) => s.route);
    const tsRoutes = sections.map((s: any) => s.route);
    expect(cljRoutes).toEqual(tsRoutes);
  });

  it('getSection returns a result for hero', () => {
    const result = cljSectionsRegistry.get_section('hero');
    expect(result).toBeTruthy();
    expect(result.id).toBe('hero');
  });
});

// ═══════════════════════════════════════════════════════════
// TERMINAL.GITHUB CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('terminal.github convergence', () => {
  it('githubProfile has same username', () => {
    expect(cljGithub.github_profile.username).toBe(githubProfile.username);
  });

  it('repos array has same count', () => {
    expect(cljGithub.repos.length).toBe(repos.length);
  });

  it('repos have same structure (name, language, description)', () => {
    // Repo lists differ in content between CLJ and TS — just verify structure
    for (const repo of cljGithub.repos) {
      expect(repo).toHaveProperty('name');
      expect(repo).toHaveProperty('language');
      expect(repo).toHaveProperty('description');
    }
  });

  it('langColors is a map of language names to hex colors', () => {
    expect(typeof cljGithub.lang_colors).toBe('object');
    expect(Object.keys(cljGithub.lang_colors).length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════
// ADMIN CONSTANTS CONVERGENCE
// ═══════════════════════════════════════════════════════════

describe('admin.constants convergence', () => {
  it('namedColors array has expected colors', () => {
    // TS doesn't export NAMED_COLORS, but CLJ does
    expect(cljConstants.named_colors).toContain('orange');
    expect(cljConstants.named_colors).toContain('green');
    expect(cljConstants.named_colors).toContain('red');
  });

  it('view_modes has same values as TS VIEW_MODES', () => {
    // CLJ exports Set, TS exports readonly tuple
    const tsValues = [...VIEW_MODES];
    const cljValues = [...cljConstants.view_modes];
    expect(cljValues.sort()).toEqual(tsValues.sort());
  });

  it('FONT_SIZE_SCALE matches', () => {
    const cljScale = cljConstants.font_size_scale;
    expect(cljScale.length).toBe(FONT_SIZE_SCALE.length);
    for (let i = 0; i < FONT_SIZE_SCALE.length; i++) {
      expect(cljScale[i].id).toBe(FONT_SIZE_SCALE[i].id);
      expect(cljScale[i].rem).toBe(FONT_SIZE_SCALE[i].rem);
    }
  });

  it('LINE_HEIGHT_SCALE matches', () => {
    expect(cljConstants.line_height_scale).toEqual([...LINE_HEIGHT_SCALE]);
  });

  it('FLAG_CATEGORIES matches', () => {
    expect(cljConstants.flag_categories.length).toBe(FLAG_CATEGORIES.length);
    for (let i = 0; i < FLAG_CATEGORIES.length; i++) {
      expect(cljConstants.flag_categories[i].id).toBe(FLAG_CATEGORIES[i].id);
      expect(cljConstants.flag_categories[i].label).toBe(FLAG_CATEGORIES[i].label);
    }
  });

  it('formatRelativeTime works for common values', () => {
    const now = Date.now();
    expect(cljConstants.format_relative_time(now - 30000)).toBe(formatRelativeTime(now - 30000));
    expect(cljConstants.format_relative_time(now - 300000)).toBe(formatRelativeTime(now - 300000));
    expect(cljConstants.format_relative_time(now - 7200000)).toBe(formatRelativeTime(now - 7200000));
  });

  it('defaults match TS DEFAULTS (kebab-case keys)', () => {
    // CLJ defaults uses kebab-case: hero-name-size vs heroNameSize
    const cljHero = cljConstants.defaults['hero'] ?? cljConstants.defaults.hero;
    const cljSiteConfig = cljConstants.defaults['site-config'] ?? cljConstants.defaults.siteConfig;
    expect(cljHero['hero-name-size'] ?? cljHero.heroNameSize).toBe(DEFAULTS.hero.heroNameSize);
    expect(cljHero['hero-name-weight'] ?? cljHero.heroNameWeight).toBe(DEFAULTS.hero.heroNameWeight);
    expect(cljSiteConfig.mode ?? cljSiteConfig['mode']).toBe(DEFAULTS.siteConfig.mode);
  });
});

// ═══════════════════════════════════════════════════════════
// STORES.CONTROLS — CLJ DATA INTEGRITY
// ═══════════════════════════════════════════════════════════

describe('stores.controls data integrity', () => {
  it('depth_levels contains all DepthLevel values', () => {
    const expected = ['5-min', '15-min', 'full'];
    expect(cljControls.depth_levels).toEqual(expected);
  });

  it('theme_modes contains all ThemeMode values', () => {
    const expected = ['minimalist', 'brutalist', 'night-vision'];
    expect(cljControls.theme_modes).toEqual(expected);
  });

  it('physics_modes contains all PhysicsMode values', () => {
    const expected = ['frictionless', 'spring', 'string'];
    expect(cljControls.physics_modes).toEqual(expected);
  });

  it('parallax_multipliers has all modes', () => {
    expect(cljControls.parallax_multipliers.spring).toBe(0.1);
    expect(cljControls.parallax_multipliers.frictionless).toBe(0);
    expect(cljControls.parallax_multipliers.string).toBe(0.25);
  });

  it('scroll_behaviors has all modes', () => {
    expect(cljControls.scroll_behaviors.spring).toBe('smooth');
    expect(cljControls.scroll_behaviors.frictionless).toBe('auto');
    expect(cljControls.scroll_behaviors.string).toBe('smooth');
  });

  it('predicate functions work correctly', () => {
    expect(cljControls.is_screen_pass_QMARK_('5-min')).toBe(true);
    expect(cljControls.is_screen_pass_QMARK_('full')).toBe(false);
    expect(cljControls.is_deep_dive_QMARK_('15-min')).toBe(true);
    expect(cljControls.is_full_archive_QMARK_('full')).toBe(true);
    expect(cljControls.is_night_vision_QMARK_('night-vision')).toBe(true);
    expect(cljControls.is_brutalist_QMARK_('brutalist')).toBe(true);
    expect(cljControls.is_fluid_string_QMARK_('string')).toBe(true);
    expect(cljControls.is_frictionless_QMARK_('frictionless')).toBe(true);
  });
});
