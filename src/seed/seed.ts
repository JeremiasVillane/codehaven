export const initialFiles = {
  "README.md": `# CodeHaven Features Demo

A simple full-stack application showcasing CodeHaven's core features with a plain HTML/CSS/JS frontend and an Express backend.

## Project Structure

\`\`\`
├── client/          # Plain HTML/CSS/JS frontend with feature showcase
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

Frontend will be available at http://localhost:8080
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
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "live-server ./src"
  },
  "devDependencies": {
    "live-server": "^1.2.2"
  }
}`,
    src: {
      "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeHaven Features</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="main.js"></script>
  </body>
</html>`,
      "style.css": `/* CSS reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: sans-serif;
  background-color: #F9FAFB;
  padding: 20px;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  color: #1F2937;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.125rem;
  color: #4B5563;
}

.filter-buttons {
  text-align: center;
  margin-bottom: 30px;
}

.filter-button {
  padding: 10px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 8px;
  background-color: white;
  color: #4B5563;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-button:hover {
  background-color: #F3F4F6;
}

.filter-button.active {
  background-color: #4F46E5;
  color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.feature-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.25rem;
  color: #1F2937;
}

.feature-card p {
  color: #4B5563;
}

.badge {
  display: inline-block;
  margin-top: 15px;
  padding: 5px 10px;
  background-color: #EEF2FF;
  color: #4F46E5;
  border-radius: 9999px;
  font-size: 0.875rem;
}`,
      "main.js": `let features = [];
let currentFilter = 'all';
const categories = ['all', 'editor', 'tools', 'preview'];

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'container';
  
  const headerDiv = document.createElement('div');
  headerDiv.className = 'header';
  const h1 = document.createElement('h1');
  h1.textContent = 'Welcome to CodeHaven';
  headerDiv.appendChild(h1);
  const p = document.createElement('p');
  p.textContent = 'Explore our powerful features for web development in the browser';
  headerDiv.appendChild(p);
  container.appendChild(headerDiv);
  
  const filterDiv = document.createElement('div');
  filterDiv.className = 'filter-buttons';
  categories.forEach(cat => {
    const button = document.createElement('button');
    button.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    button.className = 'filter-button' + (currentFilter === cat ? ' active' : '');
    button.addEventListener('click', () => {
      currentFilter = cat;
      renderApp();
    });
    filterDiv.appendChild(button);
  });
  container.appendChild(filterDiv);
  
  const featuresDiv = document.createElement('div');
  featuresDiv.className = 'features-grid';
  const filteredFeatures = features.filter(feature => currentFilter === 'all' || feature.category === currentFilter);
  
  filteredFeatures.forEach(feature => {
    const card = document.createElement('div');
    card.className = 'feature-card';
    
    const title = document.createElement('h3');
    title.textContent = feature.title;
    card.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = feature.description;
    card.appendChild(description);
    
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = feature.category;
    card.appendChild(badge);
    
    featuresDiv.appendChild(card);
  });
  
  container.appendChild(featuresDiv);
  app.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = '<p>Loading features...</p>';
  
  fetch('http://localhost:3000/api/features')
    .then(response => response.json())
    .then(data => {
      features = data;
      renderApp();
    })
    .catch(error => {
      console.error('Error fetching features:', error);
      app.innerHTML = '<p>The server is not yet available. Please refresh this page when the server is up.</p>';
    });
});`,
    },
  },
};
