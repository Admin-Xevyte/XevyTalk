# Cloudflare Pages Configuration

## Build Configuration
- **Build command**: `npm run build`
- **Build output directory**: `client/dist`
- **Root directory**: `/` (leave as default)
- **Node version**: `18`

## Environment Variables
Add these in Cloudflare Pages dashboard:
- `NODE_VERSION`: `18`
- `VITE_API_URL`: `https://xevytalk-server.onrender.com` (your backend URL)

## Build Settings in Cloudflare Dashboard

1. Go to your Cloudflare Pages project
2. Click on "Settings" → "Builds & deployments"
3. Set:
   - **Framework preset**: None (or Vite if available)
   - **Build command**: `npm run build`
   - **Build output directory**: `client/dist`
   - **Root directory**: `/` (leave empty or set to root)

## How It Works

The build process:
1. Runs `npm run build` from the root directory
2. This executes `cd client && npm install && npm run build`
3. Vite builds the React app and outputs to `client/dist`
4. The `_redirects` file is automatically copied to `client/dist`
5. Cloudflare Pages serves the static files from `client/dist`

## Troubleshooting Build Failures

### Error: "Build failed after 17s"
This usually means the build command couldn't find the necessary files.

**Solution**: Make sure:
- Build command is: `npm run build`
- Build output directory is: `client/dist`
- Root directory is: `/` (or empty)

### Error: "Module not found"
**Solution**: The build script now includes `npm install` to ensure dependencies are installed.

### Error: "Node version mismatch"
**Solution**: 
- Add `.node-version` file with `18` (already created)
- Or set `NODE_VERSION=18` in environment variables

## Alternative: Use GitHub Actions

If Cloudflare Pages auto-deployment keeps failing, you can disable it and use GitHub Actions instead.

See `.github/workflows/deploy.yml` for the workflow configuration.
