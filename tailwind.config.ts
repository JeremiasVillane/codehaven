import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        header: {
          background: "hsl(var(--header-background))",
          foreground: "hsl(var(--header-foreground))",
        },
        topbar: {
          background: "hsl(var(--topbar-background))",
          foreground: "hsl(var(--topbar-foreground))",
        },
        sidebar: {
          background: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
        },
        editor: {
          background: "hsl(var(--editor-background))",
          foreground: "hsl(var(--editor-foreground))",
        },
        terminal: {
          background: "hsl(var(--terminal-background))",
        },
        preview: {
          background: "hsl(var(--preview-background))",
          foreground: "hsl(var(--preview-foreground))",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      width: {
        "21": "84px", // 21 * 4px = 84px
        "36": "144px", // 36 * 4px = 144px
      },
    },
  },
} satisfies Config;
