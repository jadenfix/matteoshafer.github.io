# Research portfolio archive

React research portfolio preserved as a project site under the current owner.

```bash
npm ci
npm run build
CI=true npm test -- --watchAll=false
```

Node.js 20 or 22. The single React Pages workflow publishes the build; the obsolete competing Jekyll deployment has been removed. Hash-based routes support refreshes on static hosting. This is a historical research presentation, not a deployed trading or model-serving system.

The production HTML mounts the React app once via `#root`; routing is owned by the App HashRouter. The old standalone HTML template is preserved at `public/archive/original-template.html`. Pages hosting must be enabled in repository Settings → Pages with GitHub Actions as its source; a successful build does not enable the hosting service.

The checked-in archive index is the source of truth for available routes. Unknown or stale hashes render an explicit recovery page instead of a blank content region. Client-side route changes update the document title and move focus to the new content for keyboard and screen-reader users. Project descriptions link to external repositories, but this site does not verify those repositories, their results, or any live services.
