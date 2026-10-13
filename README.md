# Research portfolio archive

React research portfolio preserved as a project site under the current owner.

```bash
npm ci
npm run build
CI=true npm test -- --watchAll=false
```

Node.js 20 or 22. The single React Pages workflow publishes the build; the obsolete competing Jekyll deployment has been removed. Hash-based routes support refreshes on static hosting. This is a historical research presentation, not a deployed trading or model-serving system.

The React application mounts into `public/index.html`. The older standalone HTML
portfolio template is preserved at `public/archive/original-template.html`; it is
historical source content and is not the React application's entry page.
