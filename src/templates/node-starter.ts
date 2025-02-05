export const nodeStarter = {
  "package.json": `{
  "name": "node-starter",
  "private": true,
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  }
}
`,
  "package-lock.json": `{
  "name": "node-starter",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "node-starter"
    }
  }
}
`,
  "index.js": `// run \`node index.js\` in the terminal

console.log(\`Hello Node.js v\${process.versions.node}!\`);
`,
  ".gitignore": `node_modules
`,
};
