# TASK: Strip Dark Mode & Deploy Authentic Editorial Studio Aesthetic

CRITICAL FIX: The site is currently stuck in an ugly "developer pitch-black dark mode" with floating white sans-serif text. Overwrite globals.css and page.tsx with pure, warm gallery styling (warm ivory/linen base, deep carbon text, refined typography, and full story booking).

1. Overwrite `app/globals.css`:
Replace the contents of `app/globals.css` with clean, warm linen foundations:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-main: #FBF9F5;
  --text-main: #1C1A17;
  --text-muted: #6E685F;
  --border-line: #E7E2D8;
  --card-bg: #FFFFFF;
  --accent-gold: #9E7D47;
}

body {
  background-color: #FBF9F5 !important;
  color: #1C1A17 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Ensure serif classes use elegant editorial styling */
.font-serif {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}