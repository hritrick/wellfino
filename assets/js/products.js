document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const filterSelect = document.getElementById('filter-products');
    const productsGrid = document.querySelector('.products-grid');
    const sortSelect = document.getElementById('sort-products');
    
    // Check URL parameters for category filter
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    // Get category from URL parameter
    const categoryParam = getUrlParameter('category');
    if (categoryParam && filterSelect) {
        // Set the filter select value based on URL parameter
        const options = Array.from(filterSelect.options);
        const matchingOption = options.find(option => 
            option.value.toLowerCase() === categoryParam.toLowerCase()
        );
        
        if (matchingOption) {
            filterSelect.value = matchingOption.value;
            // We'll apply the filter after products are loaded
        }
    }
    
    // Real product data from product-pages directory
    const productData = [
        {
            id: 1,
            name: "Welfix-UT",
            description: "Treatment for urinary tract infections.",
            type: "Gynaecology",
            price: "₹225.00",
            slug: "welfix-ut"
        },
        {
            id: 2,
            name: "Welfix-OVA",
            description: "PCOS management and fertility support supplement.",
            type: "Gynaecology",
            price: "₹285.00",
            slug: "welfix-ova"
        },
        {
            id: 3,
            name: "Welfipan-DSR",
            description: "Treats Acidity, Nausea, Peptic Ulcer and Vomiting.",
            type: "PPI",
            price: "₹125.00",
            slug: "welfipan-dsr"
        },
        {
            id: 4,
            name: "Vibenerve",
            description: "B-complex vitamins for nerve health and function.",
            type: "General",
            price: "₹245.00",
            slug: "vibenerve"
        },
        {
            id: 5,
            name: "Uphem",
            description: "Iron supplement for anemia and iron deficiency.",
            type: "Gynaecology",
            price: "₹175.00",
            slug: "uphem"
        },
        {
            id: 6,
            name: "Unergy-Q10",
            description: "Coenzyme Q10 supplement for energy and heart health.",
            type: "General",
            price: "₹525.00",
            slug: "unergy-q10"
        },
        {
            id: 7,
            name: "U4Glow",
            description: "Face wash with kojic acid, glutathione, and vitamins C & E.",
            type: "Dermatology",
            price: "₹299.00",
            slug: "u4glow-facewash"
        },
        {
            id: 8,
            name: "Pronix-20",
            description: "Proton pump inhibitor (PPI) for acid-related disorders.",
            type: "PPI",
            price: "₹425.00",
            slug: "pronix-20"
        },
        {
            id: 9,
            name: "Pro-Nivcal",
            description: "Advanced calcium supplement with vitamin D.",
            type: "Gynaecology",
            price: "₹175.00",
            slug: "pro-nivcal"
        },
        {
            id: 10,
            name: "Nivrab-DSR",
            description: "Delayed-release capsule for acid reflux treatment.",
            type: "PPI",
            price: "₹125.00",
            slug: "nivrab-dsr"
        },
        {
            id: 11,
            name: "NIV-D3",
            description: "Vitamin D3 supplement for bone health.",
            type: "Orthopedic",
            price: "₹120.00",
            slug: "niv-d3"
        },
        {
            id: 12,
            name: "Niqcee-Z",
            description: "Vitamin C and zinc supplement for immunity.",
            type: "General",
            price: "₹120.00",
            slug: "niqcee-z"
        },
        {
            id: 13,
            name: "Nilobact-200LB",
            description: "Probiotic supplement for digestive health.",
            type: "Antibiotics",
            price: "₹145.00",
            slug: "nilobact"
        },
        {
            id: 14,
            name: "Morrcef-CV",
            description: "Combination antibiotic for bacterial infections.",
            type: "Antibiotics",
            price: "₹265.00",
            slug: "morrcef-cv"
        },
        {
            id: 15,
            name: "Mivinta",
            description: "Basic nutritional supplement for adults.",
            type: "General",
            price: "₹165.00",
            slug: "mivinta"
        },
        {
            id: 16,
            name: "Mivinta Pro (Elaichi)",
            description: "Protein with DHA, multivitamins, and minerals for immunity.",
            type: "General",
            price: "₹399.00",
            slug: "mivinta-pro-elaichi"
        },
        {
            id: 17,
            name: "Mivinta Pro (Chocolate)",
            description: "Protein with DHA, multivitamins, and minerals for immunity.",
            type: "General",
            price: "₹399.00",
            slug: "mivinta-pro-choc"
        },
        {
            id: 18,
            name: "Lusazic",
            description: "Anti-dandruff shampoo with antifungal properties.",
            type: "Dermatology",
            price: "₹449.00",
            slug: "lusazic"
        },
        {
            id: 19,
            name: "Lubexin",
            description: "Anti-fungal cream that targets and eliminates fungal infections, soothing irritated skin.",
            type: "Dermatology",
            price: "₹125.00",
            slug: "lubexin"
        },
        {
            id: 20,
            name: "Laxomyn",
            description: "Gentle laxative for constipation relief.",
            type: "General",
            price: "₹125.00",
            slug: "laxomyn"
        },
        {
            id: 21,
            name: "K2-Nivcal",
            description: "Vitamin K2 with calcium for bone health.",
            type: "Orthopedic",
            price: "₹185.00",
            slug: "k2-nivcal"
        },
        {
            id: 22,
            name: "Jigfol",
            description: "Folic acid supplement for pregnancy health.",
            type: "Gynaecology",
            price: "₹225.00",
            slug: "jigfol"
        },
        {
            id: 23,
            name: "Hidranergy",
            description: "Oral Rehydration salts with electrolytes, vitamin C and lactobacillus.",
            type: "General",
            price: "₹36.00",
            slug: "hidranergy"
        },
        {
            id: 24,
            name: "Enzonix",
            description: "Proteolytic enzyme formula for inflammation and tissue repair.",
            type: "Orthopedic",
            price: "₹225.00",
            slug: "enzonix"
        },
        {
            id: 25,
            name: "Emvaas",
            description: "Gentle, pH-balanced feminine wash.",
            type: "Gynaecology",
            price: "₹185.00",
            slug: "emvaas"
        },
        {
            id: 26,
            name: "Dozinix",
            description: "Relieves nausea and vomiting during pregnancy.",
            type: "Gynaecology",
            price: "₹99.00",
            slug: "dozinix"
        },
        {
            id: 27,
            name: "Blissglow-H",
            description: "Nourishes skin and hair from within for a radiant, healthy glow.",
            type: "Dermatology",
            price: "₹225.00",
            slug: "blissglow-h"
        },
        {
            id: 28,
            name: "Allemont-LC",
            description: "Anti-allergic combination for allergic rhinitis and cough.",
            type: "General",
            price: "₹130.00",
            slug: "allemont-lc"
        },
        {
            id: 29,
            name: "Acepimol-Cold",
            description: "Relief from cold, cough, and flu symptoms.",
            type: "General",
            price: "₹99.00",
            slug: "acepimol-cold"
        },
        {
            id: 30,
            name: "Acepimol-SP",
            description: "Strong pain reliever with extended release formula.",
            type: "General",
            price: "₹125.00",
            slug: "acepimol-sp"
        },
        {
            id: 31,
            name: "Xitcid",
            description: "Treatment for excessive stomach acid production.",
            type: "PPI",
            price: "₹80.00",
            slug: "xitcid"
        },
        {
            id: 32,
            name: "Xitmox-LB625",
            description: "Advanced probiotic blend with lactobacillus.",
            type: "Antibiotics",
            price: "₹165.00",
            slug: "xitmox-lb625"
        }
    ];

    // Function to load products
    function loadProducts() {
        productsGrid.innerHTML = ''; // Clear existing products
        
        productData.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.setProperty('--animation-order', (index % 8) + 1);
            
            productCard.innerHTML = `
                <div class="product-image">
                    <a href="product-pages/${product.slug}.html">
                        <img src="assets/img/products/${getProductImage(product.slug)}" alt="${product.name}">
                    </a>
                    <span class="product-tag">${product.type}</span>
                    <button class="share-button" aria-label="Share product">
                        <i class="ri-share-line"></i>
                    </button>
                    <div class="share-tooltip">
                        <div class="share-option" data-type="facebook">
                            <i class="ri-facebook-fill"></i>
                            <span>Facebook</span>
                        </div>
                        <div class="share-option" data-type="twitter">
                            <i class="ri-twitter-x-fill"></i>
                            <span>Twitter</span>
                        </div>
                        <div class="share-option" data-type="whatsapp">
                            <i class="ri-whatsapp-line"></i>
                            <span>WhatsApp</span>
                        </div>
                        <div class="share-option" data-type="copy">
                            <i class="ri-link"></i>
                            <span>Copy Link</span>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <a href="product-pages/${product.slug}.html">
                        <h3 class="product-name">${product.name}</h3>
                    </a>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-form">${getProductForm(product.slug)}</span>
                        <span class="product-price">${product.price}</span>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Apply filter if URL parameter exists
        if (categoryParam && filterSelect && filterSelect.value !== 'all') {
            applyFilter(filterSelect.value);
        }
    }
    
    // Function to apply filter
    function applyFilter(filterValue) {
        document.querySelectorAll('.product-card').forEach(card => {
            const productTag = card.querySelector('.product-tag');
            
            if (filterValue === 'all' || (productTag && productTag.textContent.toLowerCase().includes(filterValue.toLowerCase()))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Reset animation order for visible cards
        setTimeout(() => {
            const visibleCards = document.querySelectorAll('.product-card[style="display: block"]');
            visibleCards.forEach((card, index) => {
                card.style.setProperty('--animation-order', index % 8 + 1);
            });
        }, 10);
    }
    
    // Function to get product image filename based on slug
    function getProductImage(slug) {
        const imageMap = {
            'acepimol-cold': 'acepimol-cold.png',
            'acepimol-sp': 'acepimol-sp.png',
            'allemont-lc': 'allemont-lc.png',
            'blissglow-h': 'blissglow-h.png',
            'dozinix': 'dozinix.png',
            'emvaas': 'emvaas.png',
            'enzonix': 'enzonix.jpeg',
            'hidranergy': 'hidranergy.png',
            'jigfol': 'jigfol.jpg',
            'k2-nivcal': 'k2-nivcal.png',
            'laxomyn': 'laxomyn.png',
            'lubexin': 'lubexin.png',
            'lusazic': 'lusazic.jpg',
            'mivinta': 'mivinta.png',
            'mivinta-pro-choc': 'mivinta-pro-choc.png',
            'mivinta-pro-elaichi': 'mivinta-pro.jpg',
            'morrcef-cv': 'morrcef-cv.png',
            'nilobact': 'nilobact.png',
            'niqcee-z': 'niqcee-z.png',
            'niv-d3': 'NIV D3.png',
            'nivrab-dsr': 'nivrab-dsr.png',
            'pro-nivcal': 'pro-nivcal.png',
            'pronix-20': 'pronix-20.jpeg',
            'u4glow-facewash': 'u4glow.png',
            'unergy-q10': 'unergy-q10.png',
            'uphem': 'uphem.jpg',
            'vibenerve': 'vibenerve.png',
            'welfipan-dsr': 'welfipan-dsr.png',
            'welfix-ova': 'welfix-ova.png',
            'welfix-ut': 'welfix-ut.jpg',
            'xitcid': 'xitcid.png',
            'xitmox-lb625': 'xitmox-lb625.png'
        };
        
        return imageMap[slug] || `${slug}.png`;
    }
    
    // Function to get product form based on slug
    function getProductForm(slug) {
        const formMap = {
            'acepimol-cold': 'Tablets',
            'acepimol-sp': 'Tablets',
            'allemont-lc': 'Tablets',
            'blissglow-h': 'Tablets',
            'dozinix': 'Tablets',
            'emvaas': 'Intimate Wash',
            'enzonix': 'Tablets',
            'hidranergy': 'ORS',
            'jigfol': 'Capsules',
            'k2-nivcal': 'Tablets',
            'laxomyn': 'Capsules',
            'lubexin': 'Cream',
            'lusazic': 'Shampoo',
            'mivinta': 'Supplement',
            'mivinta-pro-choc': 'Supplement',
            'mivinta-pro-elaichi': 'Supplement',
            'morrcef-cv': 'Tablets',
            'nilobact': 'Tablets',
            'niqcee-z': 'Tablets',
            'niv-d3': 'Capsules',
            'nivrab-dsr': 'Capsules',
            'pro-nivcal': 'Tablets',
            'pronix-20': 'Tablets',
            'u4glow-facewash': 'Facewash',
            'unergy-q10': 'Capsules',
            'uphem': 'Tablets',
            'vibenerve': 'Tablets',
            'welfipan-dsr': 'Capsules',
            'welfix-ova': 'Tablets',
            'welfix-ut': 'Syrup',
            'xitcid': 'Tablets',
            'xitmox-lb625': 'Tablets'
        };
        
        return formMap[slug] || 'Tablets';
    }
    
    // Load products on page load
    loadProducts();
    
    // Set animation order for initial products
    function setAnimationOrder() {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.setProperty('--animation-order', index % 8 + 1); // Increased to 8 for more variation
        });
    }
    
    // Initialize animation order
    setAnimationOrder();
    
    // Initialize product card links
    function initProductLinks() {
        // Prevent default click behavior on entire card to avoid interfering with links
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Only handle click if not clicking on a link or share button
                if (!e.target.closest('a') && !e.target.closest('.share-button') && !e.target.closest('.share-tooltip')) {
                    const productLink = card.querySelector('.product-info a');
                    if (productLink) {
                        window.location.href = productLink.getAttribute('href');
                    }
                }
            });
        });
    }
    
    // Initialize product links
    initProductLinks();
    
    // Share functionality for product cards
    function initShareButtons() {
        const shareButtons = document.querySelectorAll('.share-button');
        const shareTooltips = document.querySelectorAll('.share-tooltip');
        
        // Close all tooltips when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.share-button') && !e.target.closest('.share-tooltip')) {
                shareTooltips.forEach(tooltip => {
                    tooltip.classList.remove('active');
                });
            }
        });
        
        // Close tooltips when scrolling (for better mobile experience)
        window.addEventListener('scroll', function() {
            shareTooltips.forEach(tooltip => {
                tooltip.classList.remove('active');
            });
        }, { passive: true });
        
        // Close tooltips when resizing window
        window.addEventListener('resize', function() {
            shareTooltips.forEach(tooltip => {
                tooltip.classList.remove('active');
            });
        }, { passive: true });
        
        // Toggle tooltip on share button click
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const tooltip = this.nextElementSibling;
                
                // Close all other tooltips
                shareTooltips.forEach(t => {
                    if (t !== tooltip) {
                        t.classList.remove('active');
                    }
                });
                
                // Toggle current tooltip
                tooltip.classList.toggle('active');
                
                // Position check for mobile - ensure tooltip stays in viewport
                setTimeout(() => {
                    const tooltipRect = tooltip.getBoundingClientRect();
                    if (tooltipRect.right > window.innerWidth) {
                        tooltip.style.right = '0';
                        tooltip.style.left = 'auto';
                    }
                    if (tooltipRect.bottom > window.innerHeight) {
                        tooltip.style.bottom = 'auto';
                        tooltip.style.top = '-120px';
                    }
                }, 10);
            });
        });
        
        // Handle share options click
        document.querySelectorAll('.share-option').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const type = this.getAttribute('data-type');
                const card = this.closest('.product-card');
                const productLink = card.querySelector('.product-info a').getAttribute('href');
                const productName = card.querySelector('.product-name').textContent;
                const productUrl = window.location.origin + window.location.pathname.replace('products.html', '') + productLink;
                
                shareProduct(type, productName, productUrl);
                
                // Close tooltip after sharing
                this.closest('.share-tooltip').classList.remove('active');
            });
        });
    }
    
    // Initialize share buttons
    if (document.querySelector('.share-button')) {
        initShareButtons();
    }
    
    // Share product function
    function shareProduct(type, title, url) {
        const text = `Check out ${title} from Wellfino Pharmaceutical`;
        
        // Fix URL path if needed
        const fixedUrl = url.replace('/products/product-pages/', '/product-pages/');
        
        switch(type) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fixedUrl)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fixedUrl)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + fixedUrl)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(fixedUrl).then(() => {
                    // Show copy success feedback
                    const copyOption = document.querySelector(`.share-option[data-type="copy"]`);
                    const originalText = copyOption.querySelector('span').textContent;
                    copyOption.querySelector('span').textContent = 'Copied!';
                    copyOption.querySelector('i').className = 'ri-check-line';
                    
                    setTimeout(() => {
                        copyOption.querySelector('span').textContent = originalText;
                        copyOption.querySelector('i').className = 'ri-link';
                    }, 2000);
                });
                break;
        }
    }
    
    // Filter products functionality
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const filterValue = this.value;
            applyFilter(filterValue);
        });
    }
    
    // Sort products functionality
    if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
            const cards = Array.from(document.querySelectorAll('.product-card'));
            
            cards.sort((a, b) => {
                const nameA = a.querySelector('.product-name').textContent;
                const nameB = b.querySelector('.product-name').textContent;
                
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('₹', '').trim());
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('₹', '').trim());
                
                switch(sortValue) {
                    case 'name-asc':
                        return nameA.localeCompare(nameB);
                    case 'name-desc':
                        return nameB.localeCompare(nameA);
                    case 'price-asc':
                        return priceA - priceB;
                    case 'price-desc':
                        return priceB - priceA;
                    default:
                        return 0; // Keep original order for default
                }
            });
            
            // Remove all cards from grid
            cards.forEach(card => {
                productsGrid.removeChild(card);
            });
            
            // Add sorted cards back to grid
            cards.forEach((card, index) => {
                productsGrid.appendChild(card);
                card.style.setProperty('--animation-order', index % 8 + 1);
            });
        });
    }
}); 