/**
 * Curated admin icon manifest.
 *
 * Every icon used inside `src/lib/admin/**` or `src/routes/admin/**` must be
 * re-exported from this file. Direct imports from `~icons/lucide/*` inside
 * admin surfaces are rejected by `tests/e2e/admin-icon-discipline.spec.ts`.
 *
 * Adding a new icon requires a one-line addition here — that is the review gate.
 */

import IconHome from "~icons/lucide/home";
import IconLayers from "~icons/lucide/layers";
import IconSettings from "~icons/lucide/settings";
import IconEye from "~icons/lucide/eye";
import IconEyeOff from "~icons/lucide/eye-off";
import IconChevronUp from "~icons/lucide/chevron-up";
import IconChevronDown from "~icons/lucide/chevron-down";
import IconChevronRight from "~icons/lucide/chevron-right";
import IconPanelLeft from "~icons/lucide/panel-left";
import IconPanelRight from "~icons/lucide/panel-right";
import IconDot from "~icons/lucide/dot";
import IconSparkles from "~icons/lucide/sparkles";
import IconTerminal from "~icons/lucide/terminal";
import IconArrowUpDown from "~icons/lucide/arrow-up-down";
import IconLayoutGrid from "~icons/lucide/layout-grid";
import IconSun from "~icons/lucide/sun";
import IconMoon from "~icons/lucide/moon";
import IconMoreHorizontal from "~icons/lucide/more-horizontal";
import IconExternalLink from "~icons/lucide/external-link";
import IconCommand from "~icons/lucide/command";
import IconOption from "~icons/lucide/option";
import IconFileText from "~icons/lucide/file-text";
import IconImage from "~icons/lucide/image";
import IconMonitor from "~icons/lucide/monitor";
import IconSmartphone from "~icons/lucide/smartphone";
import IconTablet from "~icons/lucide/tablet";
import IconArrowUp from "~icons/lucide/arrow-up";
import IconMessageSquare from "~icons/lucide/message-square";
import IconLink from "~icons/lucide/link";
import IconCircle from "~icons/lucide/circle";
import IconCircleDot from "~icons/lucide/circle-dot";
import IconWaves from "~icons/lucide/waves";
import IconBell from "~icons/lucide/bell";
import IconArrowUpCircle from "~icons/lucide/arrow-up-circle";
import IconTerminalSquare from "~icons/lucide/terminal-square";
import IconAppWindow from "~icons/lucide/app-window";
import IconAtSign from "~icons/lucide/at-sign";
import IconX from "~icons/lucide/x";
import IconArrowDown from "~icons/lucide/arrow-down";
import IconGithub from "~icons/lucide/github";
import IconPlus from "~icons/lucide/plus";
import IconTrash from "~icons/lucide/trash-2";
import IconPencil from "~icons/lucide/pencil";
import IconCheck from "~icons/lucide/check";
import IconSearch from "~icons/lucide/search";
import IconDownload from "~icons/lucide/download";
import IconHistory from "~icons/lucide/history";
import IconRotateCw from "~icons/lucide/rotate-cw";
import IconClock from "~icons/lucide/clock";
import IconUser from "~icons/lucide/user";
import IconDatabase from "~icons/lucide/database";
import IconActivity from "~icons/lucide/activity";

export {
	IconHome,
	IconLayers,
	IconSettings,
	IconEye,
	IconEyeOff,
	IconChevronUp,
	IconChevronDown,
	IconChevronRight,
	IconPanelLeft,
	IconPanelRight,
	IconDot,
	IconSparkles,
	IconTerminal,
	IconArrowUpDown,
	IconLayoutGrid,
	IconSun,
	IconMoon,
	IconMoreHorizontal,
	IconExternalLink,
	IconCommand,
	IconOption,
	IconFileText,
	IconImage,
	IconMonitor,
	IconSmartphone,
	IconTablet,
	IconArrowUp,
	IconMessageSquare,
	IconLink,
	IconCircle,
	IconCircleDot,
	IconWaves,
	IconBell,
	IconArrowUpCircle,
	IconTerminalSquare,
	IconAppWindow,
	IconAtSign,
	IconX,
	IconArrowDown,
	IconGithub,
	IconPlus,
	IconTrash,
	IconPencil,
	IconCheck,
	IconSearch,
	IconDownload,
	IconHistory,
	IconRotateCw,
	IconClock,
	IconUser,
	IconDatabase,
	IconActivity,
};

export type AdminIconComponent = typeof IconHome;

/**
 * Resolve an iconify key like `"lucide:sparkles"` into the corresponding
 * admin-icon component. Used by `flagIndicatorRegistry` so the registry can
 * store string keys while the renderer gets a real component.
 *
 * Only keys that map to an icon exported from this file are supported.
 */
const ICONIFY_KEY_MAP: Record<string, AdminIconComponent> = {
	"lucide:home": IconHome,
	"lucide:layers": IconLayers,
	"lucide:settings": IconSettings,
	"lucide:eye": IconEye,
	"lucide:eye-off": IconEyeOff,
	"lucide:sparkles": IconSparkles,
	"lucide:terminal": IconTerminal,
	"lucide:terminal-square": IconTerminalSquare,
	"lucide:arrow-up-down": IconArrowUpDown,
	"lucide:layout-grid": IconLayoutGrid,
	"lucide:dot": IconDot,
	"lucide:more-horizontal": IconMoreHorizontal,
	"lucide:command": IconCommand,
	"lucide:option": IconOption,
	"lucide:file-text": IconFileText,
	"lucide:image": IconImage,
	"lucide:monitor": IconMonitor,
	"lucide:smartphone": IconSmartphone,
	"lucide:tablet": IconTablet,
	"lucide:arrow-up": IconArrowUp,
	"lucide:arrow-up-circle": IconArrowUpCircle,
	"lucide:message-square": IconMessageSquare,
	"lucide:link": IconLink,
	"lucide:circle": IconCircle,
	"lucide:circle-dot": IconCircleDot,
	"lucide:waves": IconWaves,
	"lucide:bell": IconBell,
	"lucide:app-window": IconAppWindow,
	"lucide:at-sign": IconAtSign,
	"lucide:external-link": IconExternalLink,
	"lucide:panel-left": IconPanelLeft,
	"lucide:panel-right": IconPanelRight,
	"lucide:chevron-up": IconChevronUp,
	"lucide:chevron-down": IconChevronDown,
	"lucide:chevron-right": IconChevronRight,
};

export function resolveIconifyKey(key: string | undefined): AdminIconComponent {
	if (!key) return IconDot;
	return ICONIFY_KEY_MAP[key] ?? IconDot;
}
