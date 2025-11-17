
# GitHub Scan UI (Angular)

This is a scaffolded Angular application with two screens:
- Scan: POSTs a repo URL to a scan endpoint to index a repository.
- Query: POSTs a multi-repo + query payload to another endpoint to get analysis results.

## Run locally

Prerequisites: Node 18+, npm

1. Install dependencies
   ```bash
   npm install
   ```

2. Add Angular Material (to set up themes & icons)
   ```bash
   npx ng add @angular/material
   ```
   Choose a theme when prompted.

3. Start dev server
   ```bash
   npm start
   ```

4. Open http://localhost:4200

## Notes
- Backend endpoints default to http://localhost:8080/api/scan and /api/query (change in src/app/services/api.service.ts)
- Tailwind is configured for convenience.
