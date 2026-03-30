/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academia from "../academia.js";
import type * as cv from "../cv.js";
import type * as gifts from "../gifts.js";
import type * as helpers from "../helpers.js";
import type * as languages from "../languages.js";
import type * as likes from "../likes.js";
import type * as sections from "../sections.js";
import type * as seed from "../seed.js";
import type * as seedAll from "../seedAll.js";
import type * as siteConfig from "../siteConfig.js";
import type * as talks from "../talks.js";
import type * as thumbnails from "../thumbnails.js";
import type * as works from "../works.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academia: typeof academia;
  cv: typeof cv;
  gifts: typeof gifts;
  helpers: typeof helpers;
  languages: typeof languages;
  likes: typeof likes;
  sections: typeof sections;
  seed: typeof seed;
  seedAll: typeof seedAll;
  siteConfig: typeof siteConfig;
  talks: typeof talks;
  thumbnails: typeof thumbnails;
  works: typeof works;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
