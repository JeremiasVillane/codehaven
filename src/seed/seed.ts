export const initialFiles = {
  "README.md": `# CodeHaven CRUD Example

A full-stack TypeScript application demonstrating basic CRUD operations with a React frontend and Express backend.

## Project Structure

\`\`\`
├── client/          # React frontend
└── server/          # Express backend
\`\`\`

## Features

- **Frontend**: React application with:
- Tailwind CSS for styling
- Form handling for creating/updating items
- Real-time item list display
- Loading states and error handling

- **Backend**: Express server with:
- RESTful API endpoints
- In-memory data store
- CORS support
- TypeScript types

## Getting Started

1. Install dependencies for both client and server:

\`\`\`sh
cd client && npm install
cd ../server && npm install
\`\`\`

2. Start the server:

\`\`\`sh
cd server
npm run dev     # Development mode
# or
npm run build && npm start  # Production mode
\`\`\`

3. Start the client:

\`\`\`sh
cd client
npm run dev
\`\`\`

The client will be available at http://localhost:5173 and the server at http://localhost:3000.

## API Endpoints

- \`GET /api/items\` - Get all items
- \`GET /api/items/:id\` - Get a single item
- \`POST /api/items\` - Create a new item
- \`PUT /api/items/:id\` - Update an item
- \`DELETE /api/items/:id\` - Delete an item

## Technologies Used

- React 18
- TypeScript
- Express
- Tailwind CSS
- Vite
- ESLint

## Development Scripts

### Client

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Lint code

### Server

- \`npm run dev\` - Start development server
- \`npm run build\` - Build TypeScript
- \`npm start\` - Start production server`,
  server: {
    ".env": "PORT=3000",
    "package.json": `{
  "name": "codehaven-fullstack-example-server",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only --watch src --poll --clear src/server.ts"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.14",
    "@types/node": "^18.11.18",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  }
}`,
    "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}`,
    src: {
      "db.ts": `export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

export type CreateItemInput = Omit<Item, "id" | "createdAt" | "updatedAt">;

export type UpdateItemInput = Partial<
  Omit<Item, "id" | "createdAt" | "updatedAt">
>;

class InMemoryStore {
  private items: Map<string, Item>;

  constructor() {
    this.items = new Map<string, Item>();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleData: CreateItemInput[] = [
      {
        title: "Laptop Pro X1",
        description: "High-performance laptop with 16GB RAM and 512GB SSD",
        price: 1299.99,
        category: "Electronics",
        inStock: true,
      },
      {
        title: "Wireless Headphones",
        description:
          "Noise-cancelling bluetooth headphones with 20hr battery life",
        price: 199.99,
        category: "Audio",
        inStock: true,
      },
      {
        title: "Smart Watch Series 5",
        description: "Fitness tracking smartwatch with heart rate monitor",
        price: 299.99,
        category: "Wearables",
        inStock: false,
      },
      {
        title: "Professional Camera Kit",
        description: "DSLR camera with 18-55mm lens and accessories",
        price: 899.99,
        category: "Photography",
        inStock: true,
      },
      {
        title: "Gaming Console Pro",
        description: "4K gaming console with 1TB storage",
        price: 499.99,
        category: "Gaming",
        inStock: false,
      },
    ];

    sampleData.forEach((item) => {
      const now = new Date();
      const id = this.generateId();
      this.items.set(id, {
        id,
        ...item,
        createdAt: now,
        updatedAt: now,
      });
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async getItems(): Promise<ApiResponse<Item[]>> {
    try {
      const items = Array.from(this.items.values());
      return {
        status: 200,
        data: items,
      };
    } catch (error) {
      return {
        status: 500,
        error: "Internal server error",
      };
    }
  }

  async getItem(id: string): Promise<ApiResponse<Item>> {
    try {
      const item = this.items.get(id);
      if (!item) {
        return {
          status: 404,
          error: "Item not found",
        };
      }
      return {
        status: 200,
        data: item,
      };
    } catch (error) {
      return {
        status: 500,
        error: "Internal server error",
      };
    }
  }

  async createItem(input: CreateItemInput): Promise<ApiResponse<Item>> {
    try {
      if (!input.title || !input.price || !input.category) {
        return {
          status: 400,
          error: "Title, price, and category are required",
        };
      }

      const now = new Date();
      const newItem: Item = {
        id: this.generateId(),
        ...input,
        createdAt: now,
        updatedAt: now,
      };

      this.items.set(newItem.id, newItem);
      return {
        status: 201,
        data: newItem,
      };
    } catch (error) {
      return {
        status: 500,
        error: "Internal server error",
      };
    }
  }

  async updateItem(
    id: string,
    input: UpdateItemInput
  ): Promise<ApiResponse<Item>> {
    try {
      const existingItem = this.items.get(id);
      if (!existingItem) {
        return {
          status: 404,
          error: "Item not found",
        };
      }

      const updatedItem: Item = {
        ...existingItem,
        ...input,
        updatedAt: new Date(),
      };

      this.items.set(id, updatedItem);
      return {
        status: 200,
        data: updatedItem,
      };
    } catch (error) {
      return {
        status: 500,
        error: "Internal server error",
      };
    }
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    try {
      const exists = this.items.has(id);
      if (!exists) {
        return {
          status: 404,
          error: "Item not found",
        };
      }

      this.items.delete(id);
      return {
        status: 204,
      };
    } catch (error) {
      return {
        status: 500,
        error: "Internal server error",
      };
    }
  }
}

export const db = new InMemoryStore();`,
      "server.ts": `import express from "express";
import cors from "cors";
import { db } from "./db";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CodeHaven: Basic CRUD Server Example</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          button { padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>CodeHaven</h1>
        <h2>Basic CRUD Server Example</h2>
        <p>This is a basic example of a CRUD application.</p>
        <button onclick="window.location.href='http://localhost:3000/api/items'">View Items</button>
      </body>
    </html>
  \`);
});

app.get("/api/items", async (_req, res) => {
  try {
    const result = await db.getItems();
    res.status(result.status).json(result.data || { error: result.error });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/items/:id", async (req, res) => {
  try {
    const result = await db.getItem(req.params.id);
    if (result.status === 200) {
      res.status(200).json(result.data);
    } else {
      res.status(result.status).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const result = await db.createItem(req.body);
    if (result.status === 201) {
      res.status(201).json(result.data);
    } else {
      res.status(result.status).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const result = await db.updateItem(req.params.id, req.body);
    if (result.status === 200) {
      res.status(200).json(result.data);
    } else {
      res.status(result.status).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const result = await db.deleteItem(req.params.id);
    if (result.status === 204) {
      res.status(204).end();
    } else {
      res.status(result.status).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(\`Server listening on port \${PORT}\`);
});`,
    },
  },
  client: {
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    "package.json": `{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@iconify/react": "^5.2.0",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
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
);`,
    "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});`,
    "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
    "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
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
}`,
    "tsconfig.json": `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}`,
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
}`,
    src: {
      services: {
        "store.ts": `export interface Item {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type CreateItemInput = Omit<Item, "id" | "createdAt" | "updatedAt">;
  export type UpdateItemInput = Partial<
    Omit<Item, "id" | "createdAt" | "updatedAt">
  >;
  
  const API_BASE = "http://localhost:3000/api";
  
  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ status: number; data?: T; error?: string }> {
    try {
      const res = await fetch(\`\${API_BASE}\${endpoint}\`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const status = res.status;
      const data = status !== 204 ? await res.json() : undefined;
      return { status, data, error: data?.error };
    } catch (error) {
      console.error(error);
      return { status: 500, error: "Error interno del servidor" };
    }
  }
  
  export const store = {
    getItems: () => request<Item[]>("/items"),
    getItem: (id: string) => request<Item>(\`/items/\${id}\`),
    createItem: (input: CreateItemInput) =>
      request<Item>("/items", { method: "POST", body: JSON.stringify(input) }),
    updateItem: (id: string, input: UpdateItemInput) =>
      request<Item>(\`/items/\${id}\`, {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    deleteItem: (id: string) =>
      request<void>(\`/items/\${id}\`, { method: "DELETE" }),
  };
  `,
      },
      "App.tsx": `import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import {
  CreateItemInput,
  Item,
  store,
  UpdateItemInput,
} from "./services/store";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateItemInput>({
    title: "",
    description: "",
    price: 0,
    category: "",
    inStock: true,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await store.getItems();
      if (response.status === 200 && response.data) {
        setItems(response.data);
        setError(null);
      } else {
        setError(response.error || "Failed to load items");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await store.updateItem(
          editingId,
          formData as UpdateItemInput
        );
        if (response.status !== 200) {
          throw new Error(response.error);
        }
      } else {
        const response = await store.createItem(formData);
        if (response.status !== 201) {
          throw new Error(response.error);
        }
      }
      setFormData({
        title: "",
        description: "",
        price: 0,
        category: "",
        inStock: true,
      });
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save item");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await store.deleteItem(id);
      if (response.status === 204) {
        await loadItems();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      inStock: item.inStock,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">CodeHaven</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Basic CRUD Client Example</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock Status
                </label>
                <select
                  value={formData.inStock.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inStock: e.target.value === "true",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon
                icon="lucide:circle-plus"
                width="24"
                height="24"
                className="h-4 w-4 mr-2"
              />
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </form>

          {loading ? (
            <div className="flex justify-center py-8">
              <Icon
                icon="lucide:loader-circle"
                className="h-8 w-8 animate-spin text-gray-400"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <span
                          className={\`px-2 py-1 rounded-full text-xs font-medium \${
                            item.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }\`}
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                      <div className="mt-2 space-x-4 text-sm text-gray-500">
                        <span>Price: \${item.price.toFixed(2)}</span>
                        <span>Category: {item.category}</span>
                        <span>
                          Created: {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      >
                        <Icon icon="lucide:pencil" className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                      >
                        <Icon icon="lucide:trash-2" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No products yet. Add your first product above!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;`,
      "index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      "main.tsx": `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
      "vite-env.d.ts": `/// <reference types="vite/client" />`,
    },
  },
};

// export const initialFiles = {
//   "index.html": `<!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8">
//     <title>Example Project</title>
//   </head>
//   <body>
//     <h1>Hello World</h1>
//   </body>
// </html>`,
//   "style.css": `body {
//   font-family: sans-serif;
//   background-color: #f0f0f0;
// }`,
//   src: {
//     "app.js": `console.log('Hi from app.js');`,
//     "utils.js": `export function sum(a, b) {
//   return a + b;
// }`,
//   },
//   "README.md": `# Example Project

// This is an example project.
// `,
// };
