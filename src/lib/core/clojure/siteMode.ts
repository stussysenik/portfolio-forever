// Re-exporting from Clojure Abstraction Layer with camelCase parity
import * as clj from "../../clj/portfolio/stores/site_mode.mjs";

export const siteMode = clj.site_mode;
export const isReaderMode = clj.is_reader_mode;
export const readerOverride = clj.reader_override;
export const siteConfig = clj.effective_site_config;
export const baseSiteConfig = clj.base_site_config;
export const featureFlags = clj.effective_feature_flags;
export const baseFeatureFlags = clj.base_feature_flags;
export const stagedOverrides = clj.staged_overrides;
export const navParadigm = clj.nav_paradigm;
export const previewMode = clj.preview_mode;
export const wipMode = clj.wip_mode;
export const wipParams = clj.wip_params;
export const wipConfig = clj.effective_wip_config;
export const wipBannerDismissed = clj.wip_banner_dismissed;
export const shouldBlockCalls = clj.should_block_calls;
export const isFeatureEnabled = clj.is_feature_enabled_QMARK_;
export const redirectIfOnePage = clj.redirect_if_one_page;
