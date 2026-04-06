# Spec: Crop Rendering

Capability for the public-facing render pipeline that consumes focal point data.

## ADDED Requirements

### Requirement: Focal Point to CSS Computation
The render layer MUST compute `object-position` from focal point fields with a defined fallback chain.

#### Scenario: Entry has focal point fields
**Given** a works entry has `focalX: 35` and `focalY: 20`
**When** the WorksSection renders the preview image
**Then** `object-position` MUST be set to `35% 20%`

#### Scenario: Entry has focal point with zoom
**Given** a works entry has `focalX: 50`, `focalY: 30`, `zoom: 1.5`
**When** the WorksSection renders the preview image
**Then** `object-position` MUST be set to `50% 30%`
**And** `transform: scale(1.5)` SHALL be applied with `transform-origin: 50% 30%`

#### Scenario: Entry has only legacy objectPosition
**Given** a works entry has `objectPosition: "left top"` but no `focalX`/`focalY`
**When** the WorksSection renders the preview image
**Then** `object-position` MUST be set to `left top` (the legacy value)
**And** no transform SHALL be applied

#### Scenario: Entry has no position data at all
**Given** a works entry has no `focalX`, no `focalY`, and no `objectPosition`
**When** the WorksSection renders the preview image
**Then** `object-position` MUST default to `center top`

## MODIFIED Requirements

### Requirement: Schema Extension
The `worksEntries` schema MUST include focal point fields alongside the existing `objectPosition`.

#### Scenario: Schema includes new optional fields
**Given** the Convex schema for `worksEntries`
**Then** `focalX` MUST be `v.optional(v.number())` with range 0–100
**And** `focalY` MUST be `v.optional(v.number())` with range 0–100
**And** `zoom` MUST be `v.optional(v.number())` with range 1.0–3.0
**And** the existing `objectPosition` field MUST remain unchanged

### Requirement: Mutation Validates Focal Point Ranges
The works `updateEntry` mutation MUST validate focal point values are within range.

#### Scenario: Valid focal point values accepted
**Given** a mutation with `focalX: 35, focalY: 20, zoom: 1.2`
**When** the mutation executes
**Then** the values MUST be stored successfully

#### Scenario: Out-of-range focal point rejected
**Given** a mutation with `focalX: 150`
**When** the mutation executes
**Then** the mutation MUST throw a validation error
**And** the entry SHALL NOT be updated
