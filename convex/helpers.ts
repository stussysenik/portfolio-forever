/** Strip undefined values from an object before passing to db.patch */
export function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}
