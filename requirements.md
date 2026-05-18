You are building a modern command palette / action launcher UI for a Chromium-based browser called Cốc Cốc Browser.

This feature is called:
“Cốc Cốc Actions”

The launcher is heavily inspired by:
- Raycast
- Arc Command Bar
- macOS Spotlight

However, this is NOT a generic OS launcher.
This launcher is specifically designed for browser-native workflows.

The UI must feel:
- extremely fast
- keyboard-first
- modern
- clean
- lightweight
- productivity-focused

The design should look production-ready and polished enough for a hackathon final demo.

--------------------------------------------------
CORE CONCEPT
--------------------------------------------------

Users trigger the launcher using a shortcut:

Shift + Shift

The launcher appears as a floating overlay on top of the browser.

Users can:
- search browser actions
- execute actions
- chain multiple actions together
- save chains as reusable macros
- launch deep links
- search the web
- open browser features
- launch macros
- use voice input

The UI should be modular because later it will be embedded directly into the browser.

Avoid making this look like:
- a chatbot
- an AI assistant
- a terminal
- a developer console

This is a:
browser-native productivity launcher.

--------------------------------------------------
LAYOUT REQUIREMENTS
--------------------------------------------------

Main launcher structure:

1. Overlay background
- dark translucent blur backdrop
- browser content still slightly visible behind
- modern glassmorphism feel

2. Floating launcher container
- centered horizontally
- upper-middle vertically
- rounded corners
- soft shadow
- smooth entrance animation

3. Top input area
Contains:
- search icon
- text input
- optional microphone icon
- placeholder text

Placeholder example:
“Search websites, browser features, settings, and more”

4. Suggestion list
- keyboard navigable
- highlighted active item
- icon per action
- optional action category
- smooth hover transition
- instant filtering

5. Footer area
Contains:
- keyboard hints
- chain mode toggle
- macro hint
- enter-to-submit hint

--------------------------------------------------
ACTION TYPES
--------------------------------------------------

The launcher supports multiple action types.

Examples:

Browser Actions:
- New Tab
- Close Tab
- Reopen Closed Tab
- Pin Tab
- Mute Tab
- Split Screen
- Reload Tab
- Open History
- Bookmark Page
- Change Theme

Search Actions:
- Web Search
- YouTube Search
- Google Maps Search
- Spotify Search

Deep Link Actions:
- Gmail Compose
- Open Discord Channel
- Open Spotify Playlist

Cốc Cốc Features:
- Open Cốc Cốc Points
- Open Vertical Search
- Open AI Sidebar

Macros:
- Morning Setup
- Work Setup
- Entertainment Mode

--------------------------------------------------
VARIABLE / PARAMETER INPUT
--------------------------------------------------

Some commands require additional parameters.

Example:
- Search query
- URL
- Email recipient
- Playlist name

When a command requires parameters:
- the command becomes selected/highlighted
- the input transforms into parameter input mode
- the selected command becomes a colored tag/pill before the text input

Example:
[ YouTube Search ] [ input field here ]

or

[ Gmail Compose ] [ recipient input ]

Reference:
similar to the attached image showing “Shopee Search”.

The transition between:
- command selection
- parameter input
must feel smooth and instant.

--------------------------------------------------
SUB COMMANDS / NESTED COMMANDS
--------------------------------------------------

Some commands contain nested actions or sub-commands.

Example:
YouTube
- Search Videos
- Trending Videos
- My Profile
- Playlists

Reference the Raycast-style nested layout:
- clean grouped list
- compact
- highly keyboard navigable
- breadcrumb/back navigation

Possible UI patterns:
- nested panel
- inline expansion
- secondary list
- breadcrumb navigation

Must feel fast and minimal.

--------------------------------------------------
CHAIN MODE
--------------------------------------------------

The launcher supports Action Chaining.

Users can combine multiple actions into a workflow.

Example chain:
- New Tab
- Web Search
- Incognito Mode

Reference the attached macro/chain screenshot.

Requirements:
- chain steps shown visually at the top
- each action represented as a compact action block
- connected visually like a workflow
- removable/editable
- drag reorder optional

When chain mode is enabled:
- selected actions are added to the chain
- input remains active for next actions

Chain UI should feel:
- visual
- understandable
- lightweight
- not overly technical

Avoid node-graph complexity.

--------------------------------------------------
MACRO SYSTEM
--------------------------------------------------

Users can save action chains as reusable macros.

Example:
“Morning Setup”

Macros should appear in suggestions like normal actions.

Macro suggestions should visually differ slightly:
- special icon
- subtle accent color
- reusable workflow feeling

Optional:
- “Save as Macro” button
- macro rename dialog
- recent macros section

--------------------------------------------------
VOICE INPUT
--------------------------------------------------

Voice input exists but is secondary.

Requirements:
- microphone button in input
- subtle recording animation
- should NOT dominate the UI

This is NOT a voice assistant product.

--------------------------------------------------
SUGGESTION ENGINE UI
--------------------------------------------------

Suggestions support:
- fuzzy matching
- aliases
- recent actions
- pinned actions
- usage frequency ranking

UI should visually support:
- recents
- favorites
- macros
- categories

Possible categories:
- Browser
- Search
- AI
- Media
- Productivity
- Macros

--------------------------------------------------
ANIMATIONS
--------------------------------------------------

Animations are extremely important.

Requirements:
- fast
- smooth
- responsive
- low-latency feel

Recommended animations:
- fade + scale on open
- smooth list transitions
- smooth command-to-parameter transition
- subtle hover states
- fluid chain block insertion

Avoid:
- slow animations
- playful animations
- bouncy effects
- mobile-app feeling

--------------------------------------------------
STYLE
--------------------------------------------------

Style direction:
- modern desktop productivity app
- Arc Browser
- Raycast
- macOS Spotlight
- Linear
- Notion
- VSCode command palette

Design language:
- dark mode first
- glassmorphism allowed
- subtle gradients allowed
- clean typography
- minimal clutter
- compact spacing
- productivity-oriented

Should feel:
- premium
- fast
- focused

--------------------------------------------------
TECHNICAL REQUIREMENTS
--------------------------------------------------

The UI will later be embedded into a Chromium-based browser.

Therefore:
- keep components modular
- avoid heavy dependencies
- keyboard accessibility is important
- support rendering as overlay
- avoid full-page layouts

This is NOT a standalone webpage.
This is an embedded browser command system.

--------------------------------------------------
IMPORTANT UX GOALS
--------------------------------------------------

The user should feel:
- “I can control the browser instantly”
- “I no longer need to search through menus”
- “This is faster than clicking”
- “This feels native to the browser”

The experience should prioritize:
- speed
- discoverability
- productivity
- keyboard-first workflows

The launcher should feel like:
“Spotlight Search for the Browser”