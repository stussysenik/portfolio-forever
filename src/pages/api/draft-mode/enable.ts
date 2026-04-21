import type { APIRoute } from "astro";
import { sanityClient } from "sanity:client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

const readToken = import.meta.env.SANITY_API_READ_TOKEN;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	if (!readToken) {
		return new Response("SANITY_API_READ_TOKEN is required for Sanity draft mode.", { status: 500 });
	}

	const clientWithToken = sanityClient.withConfig({
		token: readToken,
		useCdn: false,
	});

	const { isValid, redirectTo = "/", studioPreviewPerspective } = await validatePreviewUrl(
		clientWithToken,
		url.toString(),
	);

	if (!isValid) {
		return new Response("Invalid preview secret.", { status: 401 });
	}

	cookies.set(perspectiveCookieName, studioPreviewPerspective ?? "drafts", {
		path: "/",
		httpOnly: false,
		sameSite: "none",
		secure: true,
	});

	return redirect(redirectTo, 307);
};
