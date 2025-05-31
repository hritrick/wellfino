#!/bin/bash

# Script to completely overwrite the product-detail-meta sections using sed

for file in *.html; do
  # Skip index and products files
  if [[ "$file" == "index.html" || "$file" == "products.html" ]]; then
    continue
  fi
  
  echo "Processing $file..."
  
  # Special handling for welfix-ut.html
  if [[ "$file" == "welfix-ut.html" ]]; then
    # Replace meta section with bottle size
    sed -i '' '/<div class="product-detail-meta">/,/<\/div>[ ]*<\/div>[ ]*<\/div>[ ]*<\/div>/c\
                    <div class="product-detail-meta">\
                        <div class="product-detail-meta-item">\
                            <span class="product-detail-meta-label">Bottle Size</span>\
                            <span class="product-detail-meta-value">200ml</span>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>' "$file"
  else
    # Replace meta section with pack size
    sed -i '' '/<div class="product-detail-meta">/,/<\/div>[ ]*<\/div>[ ]*<\/div>[ ]*<\/div>/c\
                    <div class="product-detail-meta">\
                        <div class="product-detail-meta-item">\
                            <span class="product-detail-meta-label">Pack Size</span>\
                            <span class="product-detail-meta-value">10 tablets</span>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>' "$file"
  fi
  
  echo "Completed processing $file"
done

echo "All files have been properly cleaned up!" 