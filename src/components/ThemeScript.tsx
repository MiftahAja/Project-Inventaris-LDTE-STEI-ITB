"use client";

const THEME_SCRIPT = `
  (function() {
    try {
      var mode = localStorage.getItem('darkMode');
      if (mode === 'true' || (mode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
`;

export default function ThemeScript() {
  // Render script tag inline - Next.js 15+ warns but it still executes
  // This is the only reliable way to prevent FOUC
  // eslint-disable-next-line react/no-danger
  return (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
      suppressHydrationWarning
    />
  );
}
