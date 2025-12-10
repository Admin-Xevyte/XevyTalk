#!/bin/bash
set -e

echo "=== Building XevyTalk for Render ==="

echo "Installing client dependencies..."
cd client
npm install
echo "Client dependencies installed ✓"

echo "Building client..."
npm run build
echo "Client built successfully ✓"

cd ..

echo "Installing server dependencies..."
cd server
npm install
cd ..
echo "Server dependencies installed ✓"

echo "=== Build complete! ==="
