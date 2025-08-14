# Web page requirements

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/raianeguilherme93-1773s-projects/v0-pizzattolog)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/oyVhIjwO1Ls)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/raianeguilherme93-1773s-projects/v0-pizzattolog](https://vercel.com/raianeguilherme93-1773s-projects/v0-pizzattolog)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/oyVhIjwO1Ls](https://v0.app/chat/projects/oyVhIjwO1Ls)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

# v0 App

This project is a Next.js App Router site using Supabase.

## Local Development

- Install deps: `pnpm install`
- Run dev server: `pnpm dev`

## Supabase Configuration

Set the following environment variables (locally and in GitHub repository secrets):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` to build and deploy the site to GitHub Pages.

Notes:
- The site is exported statically (no server needed) and will read Supabase directly from the browser using the public anon key.
- For Project Pages (repo `user/repo`), assets are served under `/<repo>`; the workflow sets `NEXT_PUBLIC_BASE_PATH=/<repo>` automatically.
- If you deploy to a custom domain or a user/organization page (root), you can omit `NEXT_PUBLIC_BASE_PATH`.

### Steps
1. In GitHub, go to Settings → Secrets and variables → Actions and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Push to `main`. The workflow builds and deploys to GitHub Pages.
3. In Settings → Pages, make sure the source is set to "GitHub Actions".

The output is placed in the `out/` directory during CI and uploaded to Pages. A `.nojekyll` file is added to avoid Jekyll processing.
