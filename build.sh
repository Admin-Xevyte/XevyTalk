#!/bin/bash
# Build script for Cloudflare Pages / GitHub Pages

echo "Building client application..."
cd client
npm install
npm run build
echo "Build complete!"
