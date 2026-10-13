# Research portfolio archive

React research portfolio preserved as a project site under the current owner.

```bash
npm ci
npm run build
CI=true npm test -- --watchAll=false
```

Node.js 20 or 22. The single React Pages workflow publishes the build; the obsolete competing Jekyll deployment has been removed. Hash-based routes support refreshes on static hosting. This is a historical research presentation, not a deployed trading or model-serving system.

The production HTML mounts the React app once via `#root`; routing is owned by the App HashRouter. The old standalone HTML template is preserved at `public/archive/original-template.html`. Pages hosting must be enabled in repository Settings → Pages with GitHub Actions as its source; a successful build does not enable the hosting service.
