---
name: software-design-standards
description: Enforce functional core-course architecture, declarative React composition, lookup tables, zero uncontrolled effects, self-documenting code, and core-focused automated testing.
---

# Software Design Standards (Functional TypeScript & React)

Executable reference for agents producing or refactoring application code in academic presentation and interactive study web platforms.

## 1. Architectural Boundary: Universal Core (`src/core/`) vs. Course Adapter (`src/course/`)

Partition the system strictly into two top-level namespaces: **`src/core/`** (reusable across any academic course) and **`src/course/`** (specific to the subject matter, e.g., Design and Analysis of Algorithms).

```
┌─────────────────────────────────────────────────────────────────────────┐
│  COURSE LAYER (src/course/)                                             │
│  - Course Data & Curated Slide Decks (src/course/data/)                 │
│  - Subject-Specific Blocks & Simulators (src/course/components/)        │
│  - Interactive Visualizers (src/course/visualizers/)                    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼ (injects course data & block registry)
┌─────────────────────────────────────────────────────────────────────────┐
│  PLATFORM CORE (src/core/)                                              │
│  - Core UI Shell: Sidebar, Slide Player, Search, Practice (src/core/ui/)│
│  - Core Domain: JSON Processors, Deck Builder, Storage (src/core/domain)│
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.1 The Platform Core (`src/core/domain` & `src/core/ui`)
- **Role:** Provides the universal foundation needed by any course web platform replacing traditional class slides:
  - **`src/core/domain`:** Pure TypeScript types, generic JSON schema processors (`teoria/` and `ejercicios/`), slide deck assembly, global search indexing, theme definitions, and `localStorage` progress/draft persistence.
  - **`src/core/ui`:** Generic functional React components for the layout shell, collapsible navigation sidebar with modules/subtopics, slide deck player, universal slide blocks (rich text, bullet lists, LaTeX math via `MathFormula`, callouts, basic tables), global search modal, and exercise practice workspace with whiteboard.
- **Course Isolation Invariant:** `src/core/` must have **zero imports or references** to `src/course/`. It must never know about specific course topics, algorithms, or subject-specific visualizers.

### 1.2 The Course Adapter (`src/course/`)
- **Role:** Supplies the subject-specific content, data adaptations, and specialized visual blocks (e.g., IDE code blocks with complexity annotations, recurrence simulators, step-by-step graph/matrix visualizers; or in other courses, video players, photo galleries, interactive maps).
- **Dependency Invariant:** Dependencies point strictly from Course to Core: $\text{Course} \longrightarrow \text{Core}$.
- **Extension Mechanism (Hybrid Block Registry):** `src/core/ui` includes a `defaultBlockRegistry` for universal academic content and accepts a typed `Record<BlockKind, React.ComponentType<BlockProps>>` lookup table from `src/course/` to render subject-specific visual blocks without coupling.

---

## 2. Functional & Declarative Design Principles

Adopt a **functional paradigm** using algebraic data types (`type`, `interface`, discriminated unions), pure transformation functions, and functional React components. Do not introduce OOP classes (`class`) or inheritance hierarchies.

### 2.1 Functional SOLID Guardrails

| Principle | Active Functional Directive | Violation Marker |
| :--- | :--- | :--- |
| **S** (Single Responsibility) | Each pure function performs one transformation; each React component acts either as a **Coordinator View** or as an **Atomic/Wrapper Component**. | Mixing data normalization, `localStorage` side effects, and complex layout markup inside a single component. |
| **O** (Open/Closed) | Extend slide blocks, themes, and visualizers by adding entries to strongly typed **Lookup Tables** (`Record<Key, Renderer>`). | Modifying core rendering logic with `switch` statements or `if/else` chains to support a new block or visualizer. |
| **L** (Substitutability) | Every component registered in a block or visualizer lookup table must honor the shared prop contract and layout constraints. | Custom block components that break container scrolling, overflow bounds, or require special-case props from the host shell. |
| **I** (Interface Segregation) | Pass narrow, focused props to subcomponents rather than passing monolithic state objects when only two fields are needed. | Atomic components receiving the entire `CourseModule` or full `App` state when they only render a badge or title. |
| **D** (Dependency Inversion) | Inject course datasets, theme palettes, and custom block registries into Core functions/components via parameters or props. | Importing `src/course/*` files directly inside `src/core/*` modules. |

### 2.2 Composition Over Configuration
- Assemble complex views by composing focused components via `children` and structural wrappers rather than creating monolithic components with dozens of boolean flags.

---

## 3. UI and Component Design Standards (React + TypeScript)

### 3.1 Single Responsibility in UI: Coordinators vs. Atomic Components
- **Coordinator Views:** Top-level views (e.g., `App`, `PresentationSlideView`, `ExamPracticeView`, `StudySidebar`) act strictly as declarative coordinators. They orchestrate state, select active items, and delegate rendering to subcomponents.
- **Atomic & Structural Wrapper Components:** Extract repetitive frames (card shells, headers, footers, badges, control bars, visualizer frames) into dedicated reusable components.
- **Granularity Scope:**
  - **Strict in `src/core/` and `src/course/components/`:** Keep files focused and modular (target $< 180$ lines per file), separating coordinators from atomic subcomponents.
  - **Pragmatic in `src/course/visualizers/` and `src/course/data/`:** Extract shared visualizer shells, playback controls, and legends into reusable wrappers, and separate large static step arrays when a visualizer exceeds $\sim 350$ lines, without artificially fragmenting a cohesive SVG diagram into micro-files.

### 3.2 Lookup Tables over Extensive Conditionals (Data Polymorphism)
- **Rule:** Prefer strongly typed mapping objects (`Record<Variant, Config>` or `Record<BlockKind, React.ComponentType<...>>`) over `switch / case` blocks or multi-branch `if / else` ladders for routing, view selection, conditional rendering, and badge/theme styling.

### 3.3 Event-Driven Unidirectional State Flow (`useEffect` as Last Resort)
- **Rule:** Handle all state transitions, validations, `localStorage` persistence, and navigation side effects directly inside origin event handlers (`onClick`, `onChange`, `onKeyDown`, callbacks).
- **Prohibition:** Avoid `useEffect` for reacting to local state changes to trigger secondary mutations, derived state updates, or redirections. Reserve `useEffect` strictly for synchronizing with external browser APIs (e.g., Canvas 2D drawing context or active DOM measurements) when no event-driven alternative exists.

### 3.4 Self-Documenting Code & Zero Explanatory Comments
- **Rule:** Code must explain itself through descriptive, semantic identifiers for variables, functions, types, and components.
- **Prohibition:** Do not add explanatory comments (`// ...`) or organizational section comments (e.g., `// Render active view`) in `.ts`, `.tsx`, or `.css` files. Ask the user first if a comment is ever considered necessary.

---

## 4. Verification & Testing Strategy

### 4.1 Test Scope: Strictly `src/core/`
- **Core Testing Mandate:** Write automated unit tests (`src/core/domain/*.test.ts`) and isolated UI component tests (`src/core/ui/*.test.tsx`) exclusively for **`src/core/`**, which represents the stable, course-agnostic platform engine.
- **No Fragile Course Content Tests:** Do not write automated tests asserting specific course texts, curated slide decks, or subject-specific visualizers in `src/course/`. Course content evolves constantly and is validated visually.

### 4.2 AAA Pattern (Arrange-Act-Assert)
Structure every automated test in `src/core/` into three clear phases (separated by blank lines, without `// Arrange` comments):
1. **Arrange:** Prepare synthetic test data (mock modules, sample slides, or stub registries) and render the component or invoke the pure function.
2. **Act:** Trigger the user interaction or function execution.
3. **Assert:** Verify the resulting state, output, or DOM accessibility contract.

---

## 5. Agent Operational Checklist

Verify every item before concluding any refactoring or implementation task:

- [ ] **Boundary Check:** Does `src/core/` have zero imports from `src/course/`?
- [ ] **Functional Paradigm:** Are all modules built with pure functions, algebraic types, and functional React components (zero classes)?
- [ ] **Lookup Tables:** Are `switch` statements and multi-branch conditionals replaced with typed Lookup Tables (`Record<...>`)?
- [ ] **Zero Secondary `useEffect`:** Are all state transitions and persistence actions executed directly inside origin event handlers?
- [ ] **Self-Documenting Code:** Is the code 100% free of explanatory and organizational comments, using clear and semantic names?
- [ ] **Coordinator vs. Atomic Split:** Are `src/core/` views and `src/course/components/` cleanly split into declarative coordinators and reusable structural wrappers?
- [ ] **Core-Only Tests Passing:** Do all unit and UI tests in `src/core/` pass with synthetic course-agnostic fixtures, and does `npm run build` succeed with zero TypeScript errors?
