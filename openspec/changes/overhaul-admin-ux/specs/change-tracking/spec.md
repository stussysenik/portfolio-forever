# Spec: Change Tracking, Reset, and History

## ADDED Requirements

### Requirement: Per-control "last changed" badge
Each control group header SHALL show a timestamp badge indicating when the value was last modified.

#### Scenario: Control was modified 2 hours ago
**Given** the hero size slider was last changed 2 hours ago
**When** the control header renders
**Then** a blue-tinted badge shows "&#9201; 2h ago"

#### Scenario: Control is at default value
**Given** the hero weight is at default (400)
**When** the control header renders
**Then** a green-tinted badge shows "default"
**And** no reset button is visible

### Requirement: Reset to default button
A dashed-border reset button SHALL appear next to modified controls.

#### Scenario: User resets a control
**Given** the hero wrap is set to NOWRAP (not default)
**When** the user clicks the "&#8634; reset" button
**Then** the wrap value reverts to WRAP (the default)
**And** the badge changes to "default" (green)
**And** the reset button disappears

#### Scenario: Control is already at default
**Given** the hero weight is 400 (default)
**Then** no reset button is rendered for that control

### Requirement: Defaults stored as constants
Default values for all admin controls MUST be defined in a `DEFAULTS` constant map.

#### Scenario: DEFAULTS constant
**Given** `DEFAULTS` is imported from constants
**Then** `DEFAULTS.hero.weight` equals 400
**And** `DEFAULTS.hero.wrap` equals 'wrap'
**And** `DEFAULTS.siteConfig.parallax` equals 0.5

### Requirement: History popover on badge click
Clicking the timestamp badge SHALL open a popover showing the last 5 changes.

#### Scenario: User clicks "2h ago" badge
**Given** the hero typography was modified multiple times
**When** the user clicks the "&#9201; 2h ago" badge
**Then** a popover opens showing up to 5 recent changes
**And** each row shows: relative timestamp, "field: oldValue -> newValue", restore button
**And** clicking "restore" reverts the value to that historical state

### Requirement: Admin history Convex table
A new `adminHistory` table MUST store change records.

#### Scenario: User changes hero size
**Given** the hero size is 1.8rem
**When** the user changes it to 2rem
**Then** a new row is inserted into `adminHistory` with table="hero", field="size", oldValue="1.8rem", newValue="2rem", timestamp=now

#### Scenario: Query recent history
**Given** 10 changes exist for hero size
**When** `getRecent({ table: "hero", field: "size", limit: 5 })` is called
**Then** the 5 most recent changes are returned, newest first
