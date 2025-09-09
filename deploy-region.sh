#!/bin/bash

# Deploy script for specific region
# Usage: ./deploy-region.sh eu|ca|kr

REGION=${1:-eu}

if [[ "$REGION" != "eu" && "$REGION" != "ca" && "$REGION" != "kr" ]]; then
    echo "Error: Region must be eu, ca, or kr"
    exit 1
fi

echo "Deploying for region: $REGION"

# Create build directory if not exists
mkdir -p dist

# Copy all files to dist
cp -r assets dist/
cp index.html dist/
cp *.js dist/ 2>/dev/null || true
cp *.json dist/ 2>/dev/null || true

# Replace EU region paths with target region
sed -i "s|./assets/images/eu/|./assets/images/$REGION/|g" dist/index.html

echo "Build completed for region: $REGION"
echo "Files ready in dist/ directory"