<img src="public/codehaven-light.png" />

# CodeHaven

An online IDE that provides a modern development environment in your browser.

## Features

- 🗂️ File Explorer with file/folder management
- 📝 **Monaco**-powered code editor with syntax highlighting and IntelliSense
- ↔️ Dock-based layout with draggable and resizable panels
- 💻 Interactive terminal with command execution
- 🗄️ In-browser server using **WebContainer API**
- 💾 Local file storage with **IndexedDB** persistence
- 🎯 Real-time preview with auto-refresh
- 🌙 Light/Dark theme support
- ⚡ Fast and responsive UI powered by **React**

## Tech Stack

### Frontend

- **React 18** with **TypeScript**
- **PrimeReact UI** components
- **rc-dock** for panel layout
- **Monaco Editor** for code editing
- **xterm.js** for terminal emulation
- **Tailwind CSS** for styling

### Core Features

- **WebContainer API** for in-browser server
- **IndexedDB** for file storage
- **File System API** integration
- **JSZip** for project export/import

### Build Tools

- Vite
- PostCSS
- ESLint
- SWC

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JeremiasVillane/codehaven.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`
