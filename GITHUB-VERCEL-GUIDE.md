# GitHub + Vercel Deployment (Clean Public URL)

Use this when you want a temporary public URL that opens directly on the homepage with no warnings and no local address.

## 1) Create a GitHub repository

1. Go to https://github.com and sign in.
2. Click **New** (top-right or from your profile menu).
3. Name it something like `clippers-ireland-homepage`.
4. Keep it **Public** (simplest for testing) or **Private** (also works with Vercel if invited).
5. Click **Create repository**.
6. Open the local folder:
   `/Users/ergopro/Documents/Codex/2026-06-14/continue-the-clippers-ireland-homepage-from/outputs/clippers-ireland-homepage-final-handoff/deploy-public`

## 2) Upload the site files to GitHub

### Option A (recommended)

Use the GitHub website for simple upload:

1. Open the new repository page.
2. Click **Add file → Upload files**.
3. Drag the entire contents of the `deploy-public` folder into GitHub (all files).
4. Commit changes.

> If your browser upload is blocked by file-size limits, use GitHub Desktop or git:
>
> - Download GitHub Desktop, add the local `deploy-public` folder, publish to the new repo, then **Sync**.

### Option B (git, no token entry needed if you sign in via browser)

```bash
cd /Users/ergopro/Documents/Codex/2026-06-14/continue-the-clippers-ireland-homepage-from/outputs/clippers-ireland-homepage-final-handoff/deploy-public
git init
git add .
git commit -m "Add Clippers Ireland homepage for staging"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/clippers-ireland-homepage.git
git push -u origin main
```

You will be prompted to sign in via browser (no token paste needed).

## 3) Connect GitHub repo to Vercel

1. Go to https://vercel.com and sign in.
2. Click **Add New... → Project**.
3. Select **Import Git Repository** and choose your new GitHub repo.
4. Set:
   - **Framework Preset**: `Other`
   - **Root Directory**: leave blank if this is the repo root, or set to `deploy-public` if you kept files inside another parent repo folder.
5. Click **Deploy**.

Vercel uses the included `vercel.json`, so the site is treated as a clean static homepage.

## 4) Confirm clean public URL

After deploy completes:

- Open the deployment URL that Vercel shows (for example `https://your-site-name.vercel.app/`).
- Verify homepage loads at the root URL (no warning/interstitial page, no login).
- Use this exact root URL in Odoo importer.

## 5) For updates

If you change files in `deploy-public`, push to GitHub again and Vercel auto-redeploys.

## 6) Files included

- `index.html`
- `styles.css`
- `script.js`
- `assets/`
- `vercel.json`

Optional deploy files included:
- `netlify.toml` (for Netlify)
- `ODOO-STAGING-DEPLOY-GUIDE.md`
