# Spec: Crop Configurator

Capability for the admin-side crop truth table and focal point editor.

## ADDED Requirements

### Requirement: Focal Point Editor
The admin MUST provide a direct-manipulation focal point editor that shows the full source image with a draggable crosshair overlay.

#### Scenario: User clicks on source image to set focal point
**Given** a works entry with a preview image URL
**When** the user expands the preview panel and clicks on the source image
**Then** the focal point crosshair moves to the click position
**And** `focalX` and `focalY` update to the percentage coordinates of the click
**And** the truth table cells update in real time

#### Scenario: User drags the crosshair to fine-tune position
**Given** a focal point is set on the source image
**When** the user drags the crosshair
**Then** the crosshair SHALL follow the pointer with no perceptible lag
**And** coordinate readout updates continuously during drag
**And** truth table cells re-render live during drag

#### Scenario: User snaps to a grid position
**Given** the focal point editor is active
**When** the user clicks one of the 9 snap positions (TL, TC, TR, CL, CC, CR, BL, BC, BR)
**Then** the crosshair MUST jump to the corresponding percentage (0/50/100 for each axis)
**And** the focal coordinates update to the snapped value

### Requirement: Truth Table Preview Grid
The admin MUST show the image cropped at multiple aspect ratios simultaneously so the user can predict exact visual output.

#### Scenario: Truth table displays four aspect ratio cells
**Given** a works entry has a preview image and a focal point set
**When** the preview panel is expanded
**Then** four preview cells SHALL be shown in a row: 16:10, 1:1, 4:3, 21:9
**And** each cell renders the image with `object-fit: cover` and `object-position` computed from the focal point
**And** each cell is labeled with its aspect ratio in monospace type

#### Scenario: Truth table updates when focal point changes
**Given** the truth table is visible
**When** the user changes the focal point (click, drag, or snap)
**Then** all four cells MUST re-render immediately with the new crop position

#### Scenario: Entry with no preview image
**Given** a works entry has no preview URL
**When** the preview panel is expanded
**Then** the truth table SHALL NOT be shown
**And** only the iframe controls (viewport, cam) are displayed

### Requirement: Zoom Control
The admin MUST provide a zoom slider that scales the image within its crop container.

#### Scenario: User adjusts zoom level
**Given** a focal point is set
**When** the user moves the zoom slider from 1.0 to 1.5
**Then** the image in all truth table cells SHALL scale by 1.5x centered on the focal point
**And** the zoom value is displayed as a numeric readout

#### Scenario: Zoom defaults to 1.0
**Given** a works entry has no zoom value stored
**When** the truth table renders
**Then** zoom MUST be treated as 1.0 (no scaling)

### Requirement: Coordinate Readout
The admin MUST display the current focal point coordinates in a clear, precise format.

#### Scenario: Coordinates shown during editing
**Given** the focal point editor is active
**When** the focal point is at position (35, 20)
**Then** the readout SHALL show `X 35%  Y 20%` in monospace tabular-nums type
**And** the readout MUST update live during drag operations

## MODIFIED Requirements

### Requirement: Works Preview Panel Integration
The existing works admin preview panel MUST integrate the truth table in place of the standalone PositionPicker.

#### Scenario: Expanded preview uses truth table for entries with preview images
**Given** a works entry has a preview image
**When** the user expands the preview panel
**Then** the CropTruthTable component SHALL be shown instead of the legacy PositionPicker
**And** the focal point editor and truth table grid are both visible

#### Scenario: Legacy entries with only objectPosition display correctly
**Given** a works entry has `objectPosition: "35% 20%"` but no `focalX`/`focalY`
**When** the preview panel is expanded
**Then** the focal point editor MUST initialize from the parsed objectPosition value
**And** editing SHALL update both the focal fields and the objectPosition field
