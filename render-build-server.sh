#!/bin/bash
set -e

echo "=== Building Server for Render ==="

echo "Installing server dependencies..."
cd server
npm install
echo "Server dependencies installed ✓"

echo "=== Server build complete! ==="

