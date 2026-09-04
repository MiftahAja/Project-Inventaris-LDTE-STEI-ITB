# AI Agent Instruction: React Code Optimization for Vercel Free Tier (SSR to SSG)

## 🎯 OBJECTIVE
Optimize this React/Next.js project by converting heavy Server-Side Rendering (SSR) pages into light Static Site Generation (SSG) pages, or enabling full static export. The main goal is to minimize Vercel Serverless Function execution and bandwidth usage on the free tier.

---

## 🛠️ TASK BREAKDOWN & INSTRUCTIONS

### Task 1: Convert Next.js App Router (folder app)
If the project uses Next.js App Router, scan all pages inside the app directory and remove components forcing dynamic rendering.
- *Action:* Ensure fetch() requests do not use { cache: 'no-store' } or dynamic tags unless absolutely necessary.
- *Action:* For dynamic routes (e.g., app/blog/[id]/page.tsx), implement generateStaticParams() to pre-render pages into HTML at build time.
  
Code Template for Agent:
tsx
// Example configuration for dynamic routes
export async function generateStaticParams() {
  const items = await fetch('https://example.com').then(res => res.json());
  return items.map((item: any) => ({
    id: item.id.toString(),
  }));
}


### Task 2: Convert Next.js Pages Router (folder pages)
If the project uses the older Pages Router, refactor data fetching methods.
- *Action:* Search for all instances of getServerSideProps across the pages directory.
- *Action:* Replace getServerSideProps with getStaticProps.
- *Action:* For dynamic routes (e.g., pages/blog/[id].tsx), pair getStaticProps with getStaticPaths using fallback: false or fallback: 'blocking'.

### Task 3: Enable Full Static Export
Configure Next.js to compile the entire project into pure HTML/CSS/JS assets.
- *Action:* Open next.config.js or next.config.mjs at the root directory.
- *Action:* Inject output: 'export' into the configuration object.

Target Configuration:
javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Forces static site generation for all eligible routes
  images: {
    unoptimized: true, // Required for static export if using next/image
  },
};

module.exports = nextConfig;


### Task 4: Client-Side Optimization (Code Splitting & Bundle Reduction)
Reduce the initial JS bundle size so that the browser does the heavy lifting, not the build server.
- *Action:* Implement React Lazy Loading (React.lazy and Suspense) for heavy components or individual page routes.
- *Action:* Check package.json for massive libraries (e.g., lodash, moment, lucide-react). Rewrite their imports to utilize *Tree Shaking* (e.g., change import { IconName } from 'lucide-react' to specialized direct sub-module imports if applicable).

---

## 🛑 CONSTRAINTS & RULES FOR THE AGENT
1. *Do Not Break UX:* If a page strictly requires real-time user-specific data (like a user dashboard), keep it client-side (use client) using standard data fetching hooks like useEffect or SWR/TanStack Query instead of Next.js server-side functions.
2. *Handle Next/Image:* Static export (output: 'export') disables Vercel's default API image optimization. Ensure images: { unoptimized: true } is added in next.config.js, or advice using standard <img> tags.
3. *Verify Build:* After making changes, run npm run build or yarn build locally to verify that the project successfully compiles without throwing type errors or missing route errors. 