#!/usr/bin/env bash
# repro.sh: Verify that GallerySection.svelte is using MediaGrid.svelte.

set -e

echo "Running Verification: MediaGrid Integration in GallerySection"

# Check if GallerySection.svelte imports MediaGrid.svelte
if grep -q 'import MediaGrid from' src/lib/sections/GallerySection.svelte; then
    echo "✅ GallerySection.svelte is already using MediaGrid."
    exit 0
else
    echo "❌ GallerySection.svelte is not using MediaGrid."
    exit 1
fi
