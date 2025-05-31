#!/bin/bash

# Script to completely fix product-detail-meta sections after removing dosage

for file in *.html; do
  # Skip index and products files
  if [[ "$file" == "index.html" || "$file" == "products.html" ]]; then
    continue
  fi
  
  echo "Processing $file..."
  
  # Create a temporary file
  TMP_FILE=$(mktemp)
  
  # Extract content to the temporary file
  cat "$file" > "$TMP_FILE"
  
  # Completely rewrite the product-detail-meta section for welfix-ut.html which needs special handling
  if [[ "$file" == "welfix-ut.html" ]]; then
    sed -i '' 's|<div class="product-detail-meta">.*<div class="product-detail-meta-item">.*<div class="product-detail-meta-item">.*</div>.*</div>|<div class="product-detail-meta">\n                        <div class="product-detail-meta-item">\n                            <span class="product-detail-meta-label">Bottle Size</span>\n                            <span class="product-detail-meta-value">200ml</span>\n                        </div>\n                    </div>|s' "$file"
  else
    # Fix all other files to just show pack size
    sed -i '' 's|<div class="product-detail-meta">.*<div class="product-detail-meta-item">.*<div class="product-detail-meta-item">.*</div>.*</div>|<div class="product-detail-meta">\n                        <div class="product-detail-meta-item">\n                            <span class="product-detail-meta-label">Pack Size</span>\n                            <span class="product-detail-meta-value">10 tablets</span>\n                        </div>\n                    </div>|s' "$file"
  fi
  
  echo "Completed processing $file"
done

echo "All product-detail-meta sections have been fixed!" 