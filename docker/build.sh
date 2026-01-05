#!/bin/bash

# Catalyst Camunda Custom Image Build Script
set -e

echo "Building custom Camunda image with catalyst-bridge..."

# Check if catalyst-bridge JAR exists
if ! ls catalyst-bridge-*.jar 1> /dev/null 2>&1; then
    echo "ERROR: catalyst-bridge JAR not found in current directory"
    echo "Please ensure catalyst-bridge-*.jar is present before building"
    exit 1
fi

# Build the custom image
echo "Building Docker image..."
docker-compose build camunda

echo ""
echo "Build complete! Your custom Camunda image is ready."
echo ""
echo "To start the stack:"
echo "  docker-compose up -d"
echo ""
echo "To rebuild after JAR updates:"
echo "  docker-compose build camunda --no-cache"
echo "  docker-compose up -d"
echo ""
echo "Modified features:"
echo "  ✓ Sample webapps removed (examples, docs, h2)"
echo "  ✓ catalyst-bridge delegate deployed to userlib"
