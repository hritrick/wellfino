#!/bin/bash

# Manual fix for all product pages
# Special handling for welfix-ut.html which needs to keep "Bottle Size" rather than "Pack Size"

for file in *.html; do
  # Skip index and products files
  if [[ "$file" == "index.html" || "$file" == "products.html" ]]; then
    continue
  fi
  
  echo "Processing $file..."
  
  # Read file content
  content=$(cat "$file")
  
  # Special handling for welfix-ut.html
  if [[ "$file" == "welfix-ut.html" ]]; then
    # Create new content with corrected meta section for bottle
    new_content=$(echo "$content" | perl -pe 's|<div class="product-detail-meta">.*?</div>\s*</div>\s*</div>\s*</div>|<div class="product-detail-meta">\n                        <div class="product-detail-meta-item">\n                            <span class="product-detail-meta-label">Bottle Size</span>\n                            <span class="product-detail-meta-value">200ml</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>|s')
  else
    # Create new content with corrected meta section for tablets
    new_content=$(echo "$content" | perl -pe 's|<div class="product-detail-meta">.*?</div>\s*</div>\s*</div>\s*</div>|<div class="product-detail-meta">\n                        <div class="product-detail-meta-item">\n                            <span class="product-detail-meta-label">Pack Size</span>\n                            <span class="product-detail-meta-value">10 tablets</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>|s')
  fi
  
  # Write new content back to file
  echo "$new_content" > "$file"
  
  echo "Completed processing $file"
done

echo "All files have been fixed!" 