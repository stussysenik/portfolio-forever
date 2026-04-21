/**
 * Admin takeout utilities for data export.
 * Ported from clj/portfolio/admin/takeouts.cljs
 */

export async function takeoutTable(table: string, data: any[]) {
	if (!data || data.length === 0) return;

	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `portfolio-${table}-${new Date().toISOString().slice(0, 10)}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export async function takeoutAll(allData: Record<string, any[]>) {
	const blob = new Blob([JSON.stringify(allData, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `portfolio-full-backup-${new Date()
		.toISOString()
		.slice(0, 10)}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
