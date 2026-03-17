# Marine AR Sandbox Toolkit
A browser-based sandbox for placing marine assets on a canvas and exporting their positions as JSON.

## Screenshot
**screenshot.png**

## How to run
No installation needed. Open the live demo directly in any modern browser:
https://fea-exorga.github.io/marine-sandbox-toolkit-entry-task/
```
Or clone and open locally:
git clone https://github.com/fea-exorga/marine-sandbox-toolkit-entry-task.git
cd marine-sandbox-toolkit-entry-task
open index.html
```

## Live Demo
Try it here: https://fea-exorga.github.io/marine-sandbox-toolkit-entry-task/

## How to use
- Click or drag any asset from the sidebar onto the canvas
- Drag placed assets to reposition them
- Click an asset to select it, press Delete or the ❌ button to remove it
- Click **Export JSON** to download the scene data as JSON

## Architecture and Design Decisions
- Immutability: Instead of changing arrays directly, I used the Spread operator and .filter() to keep the state history clean and prevent bugs in UI.
- Separation of Concerns: Logic is isolated in lib/sandbox.js, making the engine independent of the browser UI.
- Test-Driven Design: Developed using the Red-Green-Refactor cycle.
- Time Mocking: To test the JSON export, I used vi.useFakeTimers().

## Testing
I have used Vitest for unit testing. To run the suite:
npm install
npm test

## JSON output
```
{
  "version": "1.0",
  "exported": "2026-03-15T10:00:00.000Z",
  "canvas": { "width": 900, "height": 600 },
  "assets": [
    { "id": "a1", "type": "shark", "emoji": "🦈", "x": 120, "y": 80 }
  ]
}
```

## File structure
```
├── index.html
├── style.css
├── script.js
├── lib/sandbox.js       — pure logic (tested)
├── tests/sandbox.test.js
└── README.md
```

## Technologies
Language: Vanilla JavaScript (ES Modules)
Testing: Vitest
Styling: CSS3
Environment: Node.js & NPM
CI/CD: GitHub Actions
