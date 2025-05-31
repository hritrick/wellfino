#!/bin/bash

# Script to remove dosage from product-detail-meta in all product files

for file in *.html; do
  # Skip index and products files
  if [[ "$file" == "index.html" || "$file" == "products.html" ]]; then
    continue
  fi
  
  echo "Processing $file..."
  
  # Remove dosage from product-detail-meta
  sed -i '' '/<div class="product-detail-meta-item">/,/<\/div>/ {
    /<span class="product-detail-meta-label">Dosage<\/span>/,/<\/div>/ {
      /<div class="product-detail-meta-item">/d
      /<span class="product-detail-meta-label">Dosage<\/span>/d
      /<span class="product-detail-meta-value">/d
      /<\/div>/d
    }
  }' "$file"
  
  echo "Completed processing $file"
done

echo "All files have been updated!" 