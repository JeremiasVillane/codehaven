export const nodeStarter = {
  "package.json": `{
  "name": "nodejs-express-starter",
  "version": "1.0.0",
  "description": "A simple Node.js starter project",
  "main": "server.js",
  "scripts": {
    "start": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "dotenv": "^16.4.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}

`,
  "server.js": `const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});
`,
  ".env": `PORT=3000
`,
};
