#!/bin/bash

# Script to fix empty div tags in product-detail-meta

for file in *.html; do
  # Skip index and products files
  if [[ "$file" == "index.html" || "$file" == "products.html" ]]; then
    continue
  fi
  
  echo "Processing $file..."
  
  # Remove empty div tags
  sed -i '' 's/<div class="product-detail-meta-item">\s*<div class="product-detail-meta-item">/<div class="product-detail-meta-item">/g' "$file"
  
  echo "Completed processing $file"
done

echo "All files have been fixed!" 