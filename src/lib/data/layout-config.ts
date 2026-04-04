/**
 * Layout Configuration
 * 
 * Centralized configuration for layout features and maintenance mode
 */

export const layoutConfig = {
        /**
         * Toggle WIP banner visibility
         * Set to false to hide the maintenance banner
         */
        showWipBanner: true,

        /**
         * WIP banner position
         * 'top' - Fixed at top of page, first element
         * 'sticky' - Sticks to top on scroll
         * 'hidden' - Not rendered
         */
        wipBannerPosition: 'top' as 'top' | 'sticky' | 'hidden',

        /**
         * WIP banner message
         */
        wipBannerMessage: 'WIP — WEBSITE IS UNDER MAINTENANCE',
};

/**
 * Mobile design tokens (used in CSS as fallback)
 */
export const mobileDesignTokens = {
        heroNameMinSize: 40, // px - minimum hero name size on mobile
        sectionPaddingMobile: 24, // px
        contentMaxWidthMobile: '100%',
        validSpacings: [16, 24, 32, 48, 64, 96, 128, 192], // px - grid-aligned spacings
};
