export const initialFiles = {
  "README.md": `# CodeHaven Features Demo

A simple full-stack TypeScript application showcasing CodeHaven's core features with a React frontend and Express backend.

## Project Structure

\`\`\`
├── client/          # React frontend with feature showcase
└── server/          # Express API serving features data
\`\`\`

## Getting Started

1. Install dependencies:
\`\`\`sh
cd client && npm install
cd ../server && npm install
\`\`\`

2. Start both servers:
\`\`\`sh
# Terminal 1 - Start backend
cd server && npm run dev

# Terminal 2 - Start frontend
cd client && npm run dev
\`\`\`

Frontend will be available at http://localhost:5173
Backend API at http://localhost:3000
`,
  server: {
    "package.json": `{
      "name": "codehaven-demo-server",
      "version": "1.0.0",
      "main": "dist/server.js",
      "scripts": {
        "dev": "ts-node-dev --respawn src/server.ts",
        "build": "tsc",
        "start": "node dist/server.js"
      },
      "dependencies": {
        "cors": "^2.8.5",
        "express": "^4.18.2"
      },
      "devDependencies": {
        "@types/cors": "^2.8.17",
        "@types/express": "^4.17.21",
        "ts-node-dev": "^2.0.0",
        "typescript": "^5.4.2"
      }
    }`,

    "tsconfig.json": `{
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true
      },
      "include": ["src"]
    }`,

    src: {
      "server.ts": `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

// Features data
const features = [
  {
    id: 1,
    title: 'Web IDE Experience',
    description: 'Full-featured code editor with syntax highlighting and autocompletion',
    category: 'editor'
  },
  {
    id: 2,
    title: 'Integrated Terminal',
    description: 'Built-in terminal for running commands and managing your project',
    category: 'tools'
  },
  {
    id: 3,
    title: 'Live Preview',
    description: 'Real-time preview of your web applications as you code',
    category: 'preview'
  },
  {
    id: 4, 
    title: 'Project Templates',
    description: 'Quick-start your projects with various framework templates',
    category: 'tools'
  },
  {
    id: 5,
    title: 'File Explorer',
    description: 'Easy file management with an intuitive tree view',
    category: 'editor'
  }
];

app.get('/', (_, res) => {
  console.log('Root endpoint accessed');
  res.json({ message: 'CodeHaven Demo API Running' });
});

app.get('/api/features', (_, res) => {
  console.log('Features endpoint accessed');
  res.json(features);
});

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});`,
    },
    ".env": `PORT=3000`,
  },

  client: {
    "package.json": `{
      "name": "codehaven-demo-client",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.64",
        "@types/react-dom": "^18.2.21",
        "@vitejs/plugin-react": "^4.2.1",
        "autoprefixer": "^10.4.18",
        "postcss": "^8.4.35",
        "tailwindcss": "^3.4.1",
        "typescript": "^5.4.2",
        "vite": "^5.1.5"
      }
    }`,
    src: {
      "App.tsx": `import { useEffect, useState } from 'react';

interface Feature {
  id: number;
  title: string;
  description: string;
  category: string;
}

function App() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/features')
      .then(res => res.json())
      .then(data => {
        setFeatures(data);
        setIsLoading(false);
      });
  }, []);

  const categories = ['all', 'editor', 'tools', 'preview'];
  const filteredFeatures = features.filter(
    f => filter === 'all' || f.category === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CodeHaven
          </h1>
          <p className="text-lg text-gray-600">
            Explore our powerful features for web development in the browser
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={\`px-4 py-2 rounded-lg \${
                filter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }\`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading features...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFeatures.map(feature => (
              <div
                key={feature.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <span className="inline-block mt-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  {feature.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;`,
      "main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

      "index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
    "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
`,
    "tsconfig.app.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`,
    "tsconfig.json": `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,
    "tsconfig.node.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
`,
    "tailwind.config.js": `export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {},
      },
      plugins: [],
    }`,
    "postcss.config.js": `export default {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    }`,
    "eslint.config.js": `import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
`,
    "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeHaven Features</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
};
