import type { APIRoute } from "astro";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	cookies.delete(perspectiveCookieName, {
		path: "/",
	});

	const returnTo = url.searchParams.get("returnTo") ?? "/";
	return redirect(returnTo, 307);
};
