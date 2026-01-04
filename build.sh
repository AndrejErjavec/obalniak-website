#!/bin/bash

echo "🧹 Cleaning previous output..."
rm -rf .next build

npx prisma generate

# Step 3: Build Next.js app
echo "🛠️  Building Next.js app in standalone mode..."
npm run build

# Step 4: Create output folder and copy necessary files
echo "📁 Creating output folder..."
mkdir -p build

echo "📂 Copying standalone server files..."
cp -r .next/standalone/. build/

echo "📂 Copying static files..."
cp -r .next/static build/.next/

echo "📂 Copying public assets..."
cp -r public build/

echo "✅ Build complete! Files ready in ./build"