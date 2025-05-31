#!/bin/bash

# Script to update all product files
# 1. Set pack size to 10 tablets
# 2. Remove category from product-detail-meta

for file in *.html; do
  # Skip index and products files
  if [[ "$file" == "index.html" || "$file" == "products.html" ]]; then
    continue
  fi
  
  echo "Processing $file..."
  
  # Update pack size to 10 tablets
  sed -i '' 's/<span class="product-detail-meta-value">[0-9]\+ tablets<\/span>/<span class="product-detail-meta-value">10 tablets<\/span>/g' "$file"
  
  # Remove category from product-detail-meta
  sed -i '' '/<div class="product-detail-meta-item">/,/<\/div>/ {
    /<span class="product-detail-meta-label">Category<\/span>/,/<\/div>/ {
      /<div class="product-detail-meta-item">/d
      /<span class="product-detail-meta-label">Category<\/span>/d
      /<span class="product-detail-meta-value">/d
      /<\/div>/d
    }
  }' "$file"
  
  echo "Completed processing $file"
done

echo "All files have been updated!" 