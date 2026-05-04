# Tree Testing Tool

A lightweight, dependency-free browser application for running **tree testing** usability studies. No server required — everything runs locally in the browser using `localStorage` and file downloads.

---

## What is Tree Testing?

Tree testing is a UX research method that evaluates how well users can navigate an information architecture. Participants are given a task (e.g. *"Where would you find information about returns?"*) and must locate the answer by clicking through a text-only representation of the navigation hierarchy. It isolates navigation from visual design, revealing structural issues in menus, sitemaps, and content organisation.

---

## Features

### Admin Application (`index.html`)

- **Campaign management** — create, open, and delete campaigns; all data persists in `localStorage`
- **Tree import** — paste or upload a navigation tree as a CSV path list or a nested Markdown list; live preview on input
- **Task editor** — define one or more tasks per campaign; each task has a question and one or more correct answer nodes selected from the tree
- **Export** — generate a self-contained single-file participant HTML with all campaign data embedded; no server or internet required to run
- **Results import** — drag-drop one or many participant JSON result files; duplicate detection prevents double-counting
- **Results analysis**:
  - Summary stats (participants, tasks, average success rate)
  - SVG bar charts: error rate per task and average time per task
  - Per-task sortable response table with **PASSED / FAILED** labels, selected item, full path taken, and time spent
- **Bilingual UI** — EN / FR toggle in the header; language preference stored in `localStorage`

### Participant Mini-App (exported `.html`)

- Standalone file — participants open it in any browser, no internet needed
- Language toggle (EN / FR) on every screen
- **Welcome screen** — participant enters their name before starting
- **Instructions screen** — warm, informal explanation of how the test works with an inline SVG illustration showing the 3-step flow (browse → select → confirm)
- **Task screens** — one per task; collapsible/expandable navigation tree; clicking a node selects it (highlighted blue with checkmark); two-step confirmation via sticky action bar at the bottom
  - **"I would find it here"** button (primary, enabled only when a node is selected) — confirms the answer and advances to the next task
  - **"I can't find it"** button (secondary) — records a null answer and advances
  - **Back button** — navigates to the previous task to review or change an answer
- **Done screen** — results JSON is automatically downloaded; screen shows the filename and a pre-filled `mailto:` link so the participant can email the file back with one click
- Result JSON includes: participant name, timestamp, per-task selected node, full path, correctness, time spent, and raw navigation history

---

## File Structure

```
index.html                  Admin app shell (header, main, modal overlay)
css/
  style.css                 Admin app styles
js/
  app.js                    Admin logic — i18n, DB layer, tree parsing,
                            campaign CRUD, results charts & sortable tables,
                            modal system, export trigger
  participant-template.js   generateParticipantHTML(campaign) — builds the
                            self-contained participant file as a string
```

---

## How to Use

### Running the Admin App

Open `index.html` directly in a browser (double-click or `file://` URL). No build step or server needed.

### Creating a Campaign

1. Click **+ New Campaign** and fill in the name, optional description, and your email address (used in the participant mailto link).
2. On the **Tree** tab, import your navigation structure:
   - **CSV** — each row is a full path from root to leaf, e.g. `Home > Products > Electronics`
   - **Markdown** — a nested list indented with 2 or 4 spaces per level
3. On the **Tasks** tab, add one task per thing you want participants to locate. Select the correct node(s) in the tree — these are used to score responses automatically.
4. On the **Export** tab, click **Export Participant File** to download the standalone HTML.

### Running the Participant Test

1. Send the exported `.html` file to participants (email, Slack, WeTransfer, etc.).
2. Participants open it in any browser.
3. They enter their name, complete all tasks by clicking nodes in the tree, then download their results JSON.
4. They use the mailto button (or manual email) to send you the JSON file.

### Analysing Results

1. In the admin app, open the campaign and go to the **Results** tab.
2. Click **Import Results** and select one or more participant JSON files.
3. View the charts and per-task tables. Click any column header to sort the response table.

---

## Data Format

### Tree Import — CSV

Each row represents a full root-to-leaf path. Separator can be a comma `,` or `>`:

```
Home > Products > Electronics
Home > Products > Clothing
Home > About Us
Contact
```

### Tree Import — Markdown

Standard nested unordered list (2 or 4 spaces per indent level):

```markdown
- Home
  - Products
    - Electronics
    - Clothing
  - About Us
- Contact
```

### Participant Result JSON

```json
{
  "campaignId": "abc123",
  "campaignName": "Website Navigation Test",
  "participantName": "Jane Smith",
  "timestamp": "2026-05-03T14:30:00.000Z",
  "tasks": [
    {
      "taskId": "task1",
      "question": "Where would you find returns information?",
      "selectedNodeId": "n_xyz",
      "selectedNodeLabel": "Returns",
      "selectedPath": ["Home", "Support", "Returns"],
      "correctNodeIds": ["n_xyz"],
      "isCorrect": true,
      "timeSpentMs": 8400,
      "navigationHistory": [
        { "nodeId": "n_xyz", "label": "Returns", "action": "select" }
      ]
    }
  ]
}
```

---

## Browser Compatibility

Works in any modern browser (Chrome, Firefox, Safari, Edge). No polyfills needed. Data is stored in `localStorage` — clearing site data will erase campaigns.

---

## Development Notes

- **No build step, no dependencies** — plain HTML, CSS, and ES5-compatible JavaScript.
- `js/app.js` contains the full admin application including translations (`T` object), the `DB` layer backed by `localStorage`, tree parsers, chart renderer (inline SVG), and sort logic.
- `js/participant-template.js` exports a single `generateParticipantHTML(campaign)` function. The participant app's JavaScript is embedded inside a template literal; all string escaping inside the embedded `<script>` uses `&quot;` for `onclick` attribute quoting and `\\n` for newline escape sequences to survive the outer template literal processing.
- The participant app renders through four screens: `welcome` → `instructions` → `task` (repeated) → `done`. State is a single `state` object; every user action (node toggle, node select, back, confirm) updates state and calls `render()` for a full redraw — no partial DOM patching.
- Tree nodes are expanded/collapsed via `state.expandedNodes` (a map of nodeId → boolean). Node selection is tracked in `state.selectedNodeId`. Going back pops the last committed result and restores the previously selected nodeId.
- The `lang` field is stored on the campaign object at creation time and passed into the exported participant file as the default language.

---

## Known Limitations / Future Work

- Results are stored in `localStorage` and the admin has no cloud sync; everything is file-based.
- No user authentication — the admin app is intended for local/single-user use.
- The participant app does not support partially saved progress (if the tab is closed, the test must restart).
- When navigating back, the tree's expanded/collapsed state is reset (the participant must re-expand sections). The previously selected node is restored.
