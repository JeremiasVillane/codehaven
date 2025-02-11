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
- 📦 Project export/import powered by **JSZip**
- 🔄 Real-time preview with auto-refresh
- 🌙 Light/Dark theme support
- ⚡ Fast and responsive UI powered by **React**
- 📑 Templates for bootstrapping new projects
- 👥 Real-time collaboration features:
  - Live cursors presence
  - Shared editing sessions
  - Project sharing via unique links
  - User avatars and online status
- 📱 Responsive mobile-friendly interface
- ⚙️ Customizable editor settings
- 🌐 **Dynamic Demo API**: Backend endpoints powering live feature data for an enhanced demo experience.

## Tech Stack

### Frontend

- **React 18** with **TypeScript**
- **PrimeReact UI** components
- **rc-dock** for panel layout
- **Monaco Editor** for advanced code editing
- **xterm.js** for terminal emulation
- **Tailwind CSS** for styling
- **Ably Spaces** for real-time collaboration

### Build Tools & Linting

- **Vite** as the development server and bundler
- **PostCSS** for CSS processing
- **ESLint** for code quality and consistency
- **SWC** for fast builds and transforms

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

4. Open your browser and navigate to `http://localhost:8080`
