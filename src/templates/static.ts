export const staticSite = {
  "styles.css": `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: black;
  background-color: white;
}

nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  gap: 0.5rem;
  border-bottom: solid 1px #aaa;
  background-color: #eee;
}

nav a {
  display: inline-block;
  min-width: 9rem;
  padding: 0.5rem;
  border-radius: 0.2rem;
  border: solid 1px #aaa;
  text-align: center;
  text-decoration: none;
  color: #555;
}

nav a[aria-current='page'] {
  color: #000;
  background-color: #d4d4d4;
}

main {
  padding: 1rem;
}

h1 {
  font-weight: bold;
  font-size: 1.5rem;
}
`,
  "script.js": `console.log('Hello!');
`,
  "page2.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Other page</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="styles.css" />
    <script type="module" src="script.js"></script>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/page2.html" aria-current="page">Other page</a>
    </nav>
    <main>
      <h1>My other page</h1>
    </main>
  </body>
</html>
`,
  "package.json": `{
  "scripts": {
    "start": "servor --reload"
  },
  "dependencies": {
    "servor": "^4.0.2"
  }
}
`,
  "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Home</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <!--
      Need a visual blank slate?
      Remove all code in \`styles.css\`!
    -->
    <link rel="stylesheet" href="styles.css" />
    <script type="module" src="script.js"></script>
  </head>
  <body>
    <nav>
      <a href="/" aria-current="page">Home</a>
      <a href="/page2.html">Other page</a>
    </nav>
    <main>
      <h1>Home page</h1>
    </main>
  </body>
</html>
`,
};
