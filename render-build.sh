#!/bin/bash
set -e

echo "=== Building XevyTalk for Render ==="

echo "Installing client dependencies (including devDependencies for build)..."
cd client
# Install all dependencies including devDependencies (needed for vite build)
npm install --include=dev
echo "Client dependencies installed ✓"

echo "Building client..."
npm run build
echo "Client built successfully ✓"

cd ..

echo "Installing server dependencies..."
cd server
npm install --production=false
cd ..
echo "Server dependencies installed ✓"

echo "=== Build complete! ==="
