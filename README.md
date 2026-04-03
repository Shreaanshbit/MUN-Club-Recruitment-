# VITB MUN Chair Dashboard

A modern, interactive dashboard for Model United Nations (MUN) chairs, built with React and Vite. This tool streamlines the management of speakers, timers, and yield controls during committee sessions.

## Features

- **General Speakers' List**:  
	- Add, remove, and reorder delegates with drag-and-drop.
	- Search and select countries from a live-updated list.
	- Manual country entry for flexibility.

- **Committee Timer**:  
	- Visual timer with warning and expiration states.
	- Automatic or manual control of speaker time.
	- Tracks total committee time and per-speaker time.

- **Yield Controls**:  
	- Yield to chair, questions, or another delegate.
	- Activity log for all yield actions.
	- Visual indication of the current speaker.

- **Responsive UI**:  
	- Clean, modern design.
	- Works on desktop and tablets.



## Code and Logic Explanation

### Overview
This project is a React-based dashboard for MUN chairs, designed to manage the flow of debate, keep track of speakers, and handle yields and timing in a committee session. The code is modular, with each major panel (queue, timer, yield) implemented as a separate React component.

### Main Components

- **App.jsx**: The root component. It manages the main state for the queue, current speaker, timers, and selected countries. It passes state and handlers as props to the child panels.
- **QueuePanel.jsx**: Handles the general speakers' list. It fetches country data from an external API, allows searching and selecting countries, and supports drag-and-drop reordering of delegates using `@dnd-kit`.
- **TimerPanel.jsx**: Manages the committee timer and per-speaker timer. It visually displays the timer, handles warning/expired states, and provides controls to start, pause, reset, or move to the next speaker.
- **YieldPanel.jsx**: Provides controls for yielding to the chair, questions, or another delegate. It logs yield actions and displays the current speaker.

### Key Logic

- **Country Fetching**: On mount, `QueuePanel` fetches a list of countries from the REST Countries API, formats them, and allows the user to search and select countries for the speakers' list.
- **Drag-and-Drop**: The speakers' queue uses `@dnd-kit` for intuitive drag-and-drop reordering. The `SortableQueueItem` component wraps each delegate for this functionality.
- **Timers**: The timer logic in `App.jsx` and `TimerPanel.jsx` uses React state and effects to count down time, trigger warnings, and reset as needed. The timer is visually represented with SVG and styled for clarity.
- **Yield Actions**: Yield actions are handled in `YieldPanel.jsx`, updating the activity log and calling the appropriate handler passed from `App.jsx`.
- **State Management**: All main state (queue, timers, selected countries, etc.) is managed in `App.jsx` and passed down as props, ensuring a single source of truth and predictable updates.

### Technologies Used
- React (functional components, hooks)
- Vite (for fast development and build)
- @dnd-kit (drag-and-drop)
- REST Countries API (for country data)
- CSS for styling and responsive design

---
