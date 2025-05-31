#!/bin/bash

# Final fix to clean up product-detail-meta sections in all product files

for file in *.html; do
  # Skip index and products files
  if [[ "$file" == "index.html" || "$file" == "products.html" ]]; then
    continue
  fi
  
  echo "Processing $file..."
  
  # Remove redundant div tags
  perl -i -pe 's|<div class="product-detail-meta">\s*<div class="product-detail-meta-item">\s*<div class="product-detail-meta-item">|<div class="product-detail-meta">\n                        <div class="product-detail-meta-item">|g' "$file"
  
  echo "Completed processing $file"
done

echo "All files have been cleaned up!" 