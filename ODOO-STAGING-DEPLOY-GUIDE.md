# Clippers Ireland — Odoo Import Staging Deploy Guide

Goal: publish this homepage on a clean public URL with no warning pages, no login, and no local address.

## What to upload

The folder `deploy-public/` in:

`/Users/ergopro/Documents/Codex/2026-06-14/continue-the-clippers-ireland-homepage-from/outputs/clippers-ireland-homepage-final-handoff/deploy-public`

contains exactly what you need:

- `index.html` (homepage entrypoint)
- `styles.css`
- `script.js`
- `assets/` (all required images/SVGs)
- `vercel.json`
- `netlify.toml`

## Option A — Vercel (recommended for quick temp URL)

1. Go to https://vercel.com and sign in to your own account.
2. Create a new project from your repo **or** upload via CLI:
   - Drag-and-drop the `deploy-public` folder to your Vercel project deployment page (if available in your plan/account flow), or
   - Create a repo with the folder and import it.
3. In project settings:
   - **Framework Preset**: `Other`
   - **Root Directory**: if the repo includes multiple folders, set it to `deploy-public`
4. Deploy.
5. Open the generated URL (looks like `https://your-project.vercel.app`).  
6. Verify homepage loads directly at:
   - `https://your-project.vercel.app/`

No token is needed from you here beyond your normal Vercel login; the file is static and contains no secret.

## Option B — Netlify (fastest drag-and-drop)

1. Sign in at https://app.netlify.com with your own account.
2. From **Sites**, choose **Add new site** → **Deploy manually**.
3. Drag the entire `deploy-public` folder into the deploy area.
4. Netlify will publish and give you a temporary URL such as:
   - `https://random-name.netlify.app`
5. Confirm homepage loads directly at:
   - `https://random-name.netlify.app/`

This is fully static, so no build step is required.

## Extra for Odoo test

- Use the root homepage URL only for the import target.
- Keep the page in one of the provider’s “staging/development” project URLs if you plan more iterations.
- If you want a repeatable import URL, keep the same project and republish from the same `deploy-public` source.
