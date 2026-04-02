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
import type * as blog from "../blog.js";
import type * as cv from "../cv.js";
import type * as display from "../display.js";
import type * as gallery from "../gallery.js";
import type * as gifts from "../gifts.js";
import type * as github from "../github.js";
import type * as helpers from "../helpers.js";
import type * as hero from "../hero.js";
import type * as labs from "../labs.js";
import type * as languages from "../languages.js";
import type * as likes from "../likes.js";
import type * as minor from "../minor.js";
import type * as pages from "../pages.js";
import type * as sectionRegistry from "../sectionRegistry.js";
import type * as sections from "../sections.js";
import type * as seed from "../seed.js";
import type * as seedAll from "../seedAll.js";
import type * as siteConfig from "../siteConfig.js";
import type * as talks from "../talks.js";
import type * as themes from "../themes.js";
import type * as thumbnails from "../thumbnails.js";
import type * as works from "../works.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academia: typeof academia;
  blog: typeof blog;
  cv: typeof cv;
  display: typeof display;
  gallery: typeof gallery;
  gifts: typeof gifts;
  github: typeof github;
  helpers: typeof helpers;
  hero: typeof hero;
  labs: typeof labs;
  languages: typeof languages;
  likes: typeof likes;
  minor: typeof minor;
  pages: typeof pages;
  sectionRegistry: typeof sectionRegistry;
  sections: typeof sections;
  seed: typeof seed;
  seedAll: typeof seedAll;
  siteConfig: typeof siteConfig;
  talks: typeof talks;
  themes: typeof themes;
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
