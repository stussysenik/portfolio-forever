# System Engineering Architecture Breakdown

## 1. High-Level System Context

The **Portfolio Forever** system is a static-first, progressive web application designed to serve as a personal digital garden, portfolio, and experimental OS playground. It leverages **SvelteKit** for universal rendering and **Sanity.io** for structured content management.

```mermaid
C4Context
      title System Context Diagram for Portfolio Forever

      Person(user, "Visitor", "A user browsing the portfolio, reading notes, or experimenting with the OS.")
      
      System_Boundary(portfolio_boundary, "Portfolio Forever") {
        System(webapp, "Web Application", "SvelteKit App. Deliveres UI, manages client-side state (OS Mode), and renders content.")
      }

      System_Ext(sanity, "Sanity.io Link", "Headless CMS. Stores structured content for Notes, Works, and Profile data.")
      System_Ext(static_storage, "Static Assets", "Images/Videos hosted externally (e.g., GTV Bucket) or locally.")

      Rel(user, webapp, "Browses, Interacts (Click, Drag, Type)", "HTTPS")
      Rel(webapp, sanity, "Fetches Content", "GROQ / HTTPS")
      Rel(webapp, static_storage, "Loads Media", "HTTPS")
```

## 2. Container Architecture

The application focuses on a clear separation of concerns between **Static Data** (hardcoded for reliability/performance) and **Dynamic Content** (Sanity for easy updates).

```mermaid
graph TD
    subgraph "Frontend (Browser)"
        UI[Svelte Components]
        Store[Svelte Stores $page]
        OS[OS Window Manager]
    end

    subgraph "Backend (SvelteKit Server)"
        Load[Server Load Functions (+page.server.ts)]
        SanityClient[Sanity Client Config]
        Cache[Build-time Prerendering]
    end

    subgraph "Data Sources"
        LocalData[lib/data/content.ts]
        CMS[Sanity API]
    end

    UI -->|Interactive Events| OS
    UI -->|Subscribes| Store
    UI -->|Renders| LocalData
    
    Load -->|Queries| SanityClient
    SanityClient -->|Fetches| CMS
    Load -.->|Hydrates| UI
```

## 3. Key Subsystems

### 3.1 Layout & Navigation Orchestration
The root layout (`src/routes/+layout.svelte`) acts as the central coordinator for the application shell.

- **Command Palette**: Listens for global keydown events (`/` or `?`) to trigger.
- **WIP Banner**: Conditionally rendered based on `layout-config`.
- **Terminal Footer**: Displays current route context and system status.

### 3.2 The OS Mode (`/os`)
An experimental route that breaks out of the standard web document flow into a window-manager paradigm.

- **State**: Fully client-side.
- **Persistence**: Ephemeral (resets on refresh).
- **Interactions**: Drag-and-drop, Focus Z-Index management.

### 3.3 Data Layer
- **Static**: `src/lib/data` contains `content.ts` for highly stable data (CV, Config).
- **Dynamic**: `src/lib/sanity` handles API connections for frequently updated content (Notes).

## 4. Directory Structure Map

| Directory | Purpose | Key Role |
|-----------|---------|----------|
| `src/lib/components` | Reusable UI | Atoms & Molecules (AsciiDonut, Video) |
| `src/lib/sanity` | CMS Logic | Client, Queries, Types |
| `src/routes/os` | Feature Route | Window Manager Logic |
| `src/routes/notes` | Dynamic Route | Server-side fetched content |
| `src/routes` | System Root | +layout.svelte (Shell), +page.svelte (Home) |
