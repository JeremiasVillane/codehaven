export const initialFiles = {
  "index.html": `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Example Project</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`,
  "style.css": `body {
  font-family: sans-serif;
  background-color: #f0f0f0;
}`,
  src: {
    "app.js": `console.log('Hi from app.js');`,
    "utils.js": `export function sum(a, b) {
  return a + b;
}`,
  },
  "README.md": `# Example Project

This is an example project.
`,
};
