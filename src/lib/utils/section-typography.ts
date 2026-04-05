/** Build inline style string from section typography config */
export function getTypographyStyle(config?: any): string {
	if (!config?.typography) return '';
	const t = config.typography;
	return [
		t.fontSize && `font-size: ${t.fontSize}rem`,
		t.fontWeight && `font-weight: ${t.fontWeight}`,
		t.letterSpacing != null && `letter-spacing: ${t.letterSpacing}em`,
		t.lineHeight && `line-height: ${t.lineHeight}`,
	].filter(Boolean).join('; ');
}
