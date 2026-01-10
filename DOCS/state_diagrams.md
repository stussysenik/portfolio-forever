# State Diagrams & Logic Flows

## 1. OS Mode Window Management
The `/os` route implements a simplified window manager. This state machine governs how windows are opened, focused, and closed.

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    state Idle {
        [*] --> WaitingForInput
    }

    state WindowOperations {
        Open: Create New Window Object
        Focus: Bring to Front (Max Z-Index)
        Drag: Update X/Y Coordinates
    }

    Idle --> Open: Double Click Icon
    Open --> Focus: Auto-focus New
    
    Idle --> Focus: Click Window
    Focus --> Drag: Mouse Down on Title Bar
    Drag --> Focus: Mouse Up
    
    Focus --> Idle: Click Close (x)
    Focus --> [*]: Exit OS Mode
```

### Logic Breakdown
1. **Z-Index Strategy**: `getMaxZ() + 1` ensures the most recently interacted window is always on top.
2. **Drag Physics**: Delta-based movement `(CurrentMouse - InitialOffset)` prevents snapping artifacts.

## 2. Global Navigation & Mobile Menu
The responsive header transitions between an inline desktop view and a toggled mobile dropdown.

```mermaid
stateDiagram-v2
    direction LR
    
    state "Desktop View (> 1024px)" as Monitor {
        [*] --> InlineLinks
        InlineLinks --> [*]
    }

    state "Mobile View (<= 1024px)" as Mobile {
        [*] --> Collapsed
        
        state Collapsed {
           Status: Button shows '@'
        }
        
        state Expanded {
           Status: Button shows '×'
           List: Visible (Absolute Position)
        }

        Collapsed --> Expanded: Click Toggle
        Expanded --> Collapsed: Click Toggle
    }

    Note right of Mobile: handled by 'socialExpanded' boolean
```

## 3. Command Palette Activation
The "Terminal Hint" system listens for specific keystrokes to mimic a command-line interface.

```mermaid
sequenceDiagram
    participant User
    participant Window as Global Window
    participant Layout
    participant CommandPalette

    User->>Window: Press '/' Key
    Window->>Layout: handleGlobalSlash(e)
    alt is Input/Textarea?
        Layout-->>User: Ignore
    else is Meta Key?
        Layout-->>User: Ignore
    else Valid Trigger
        Layout->>Window: dispatchEvent(Key '?')
        Window->>CommandPalette: Listen for '?'
        CommandPalette->>CommandPalette: Toggle Visibility
        CommandPalette-->>User: Show Palette
    end
```
