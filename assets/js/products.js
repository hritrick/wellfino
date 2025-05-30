document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const filterSelect = document.getElementById('filter-products');
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.querySelector('.products-grid');
    const sortSelect = document.getElementById('sort-products');
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    let isMenuOpen = false;
    let lastScrollTop = 0;
    let scrollTimer;
    
    // Set animation order for initial products
    function setAnimationOrder() {
        productCards.forEach((card, index) => {
            card.style.setProperty('--animation-order', index % 8 + 1); // Increased to 8 for more variation
        });
    }
    
    // Initialize animation order
    setAnimationOrder();
    
    // Initialize product card links
    function initProductLinks() {
        // Prevent default click behavior on entire card to avoid interfering with links
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Only handle click if not clicking on a link
                if (!e.target.closest('a')) {
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
    
    // Handle scroll events for header styling with improved smoothness
    function handleScroll() {
        clearTimeout(scrollTimer);
        
        scrollTimer = setTimeout(function() {
            const currentScrollTop = window.scrollY;
            
            if (currentScrollTop > 50) {
                if (!header.classList.contains('scrolled')) {
                    header.classList.add('scrolled');
                    // Adjust logo size on scroll with smooth transition
                    const logoImg = document.querySelector('.logo-link img');
                    if (logoImg) {
                        logoImg.style.transition = 'height 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        logoImg.style.height = '36px';
                    }
                }
            } else {
                if (header.classList.contains('scrolled')) {
                    header.classList.remove('scrolled');
                    // Reset logo size with smooth transition
                    const logoImg = document.querySelector('.logo-link img');
                    if (logoImg) {
                        logoImg.style.transition = 'height 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        logoImg.style.height = '';
                    }
                }
            }
            
            lastScrollTop = currentScrollTop;
        }, 10); // Small timeout for better performance while maintaining smoothness
    }

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize on page load
    handleScroll();
    
    // Filter products with animation using dropdown
    filterSelect.addEventListener('change', function() {
        const filter = this.value;
        
        // Add subtle animation to the select
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
        
        // Add fade out animation to products grid
        productsGrid.style.opacity = '0';
        
        setTimeout(() => {
            // Filter products
            let visibleCount = 0;
            productCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    const tagElement = card.querySelector('.product-tag');
                    const tagText = tagElement ? tagElement.textContent.toLowerCase() : '';
                    const tagClass = tagElement ? tagElement.className.toLowerCase() : '';
                    
                    if ((filter === 'general' && tagText === 'general') || 
                        (filter === 'gynaecology' && (tagText === 'gynaecology' || tagClass.includes('gynaecology'))) || 
                        (filter === 'orthopedic' && (tagText === 'orthopedic' || tagClass.includes('orthopedic'))) ||
                        (filter === 'dermatology' && (tagText === 'dermatology' || tagClass.includes('dermatology'))) ||
                        (filter === 'antibiotics' && (tagText === 'antibiotics' || tagClass.includes('antibiotics'))) ||
                        (filter === 'ppi' && (tagText === 'ppi' || tagClass.includes('ppi')))) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Reset animation order for visible cards
            let order = 1;
            productCards.forEach(card => {
                if (card.style.display !== 'none') {
                    card.style.setProperty('--animation-order', order % 8); // Increased to 8
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    order++;
                }
            });
            
            // Fade in the grid
            productsGrid.style.opacity = '1';
            
            // Animate visible cards with staggered delay
            setTimeout(() => {
                let delay = 0;
                productCards.forEach(card => {
                    if (card.style.display !== 'none') {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        }, delay);
                        delay += 50;
                    }
                });
            }, 100);
            
            // Show message if no products found
            if (visibleCount === 0 && filter !== 'all') {
                const noProductsMsg = document.createElement('div');
                noProductsMsg.className = 'no-products-message';
                noProductsMsg.innerHTML = `<p>No products found in the "${filter}" category. <button class="reset-filter">View all products</button></p>`;
                productsGrid.appendChild(noProductsMsg);
                
                // Add event listener to reset button
                const resetBtn = noProductsMsg.querySelector('.reset-filter');
                resetBtn.addEventListener('click', function() {
                    // Set the filter dropdown back to "all"
                    filterSelect.value = 'all';
                    // Trigger the change event
                    const event = new Event('change');
                    filterSelect.dispatchEvent(event);
                });
            } else {
                // Remove any existing "no products" message
                const existingMsg = productsGrid.querySelector('.no-products-message');
                if (existingMsg) {
                    existingMsg.remove();
                }
            }
        }, 300); // Delay to allow fade out animation
    });
    
    // Sort products with animation
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const products = Array.from(productCards);
        
        // Add fade out animation
        productsGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            products.sort((a, b) => {
                if (sortValue === 'default') return 0;
                
                const nameA = a.querySelector('.product-name').textContent;
                const nameB = b.querySelector('.product-name').textContent;
                
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('₹', ''));
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('₹', ''));
                
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
                        return 0;
                }
            });
            
            // Apply visual effects during sorting
            products.forEach((product, index) => {
                // Add staggered animation delay
                product.style.setProperty('--animation-order', index % 8 + 1); // Increased to 8
                
                // Reset opacity and transform for animation
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                
                // Reappend to apply the new order
                productsGrid.appendChild(product);
            });
            
            // Fade in the grid
            productsGrid.style.opacity = '1';
            
            // Animate cards back in with staggered delay
            let delay = 100;
            products.forEach(product => {
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                    product.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                }, delay);
                delay += 50;
            });
        }, 300); // Delay to allow fade out animation
    });
    
    // Handle mobile menu with improved animations
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            isMenuOpen = !isMenuOpen;
            
            // Add transition before adding active class for smoother animation
            navbar.style.transition = 'right 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            
            if (isMenuOpen) {
                // Use requestAnimationFrame for smoother animation
                requestAnimationFrame(() => {
                    navbar.classList.add('active');
                    
                    // Smooth icon transition
                    this.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                    this.style.transform = 'rotate(90deg)';
                    
                    // Wait for transform transition before changing the icon
                    setTimeout(() => {
                        this.innerHTML = '<i class="ri-close-line"></i>';
                        this.style.transform = 'rotate(0deg)';
                    }, 150);
                    
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                });
            } else {
                navbar.classList.remove('active');
                
                // Smooth icon transition
                this.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                this.style.transform = 'rotate(-90deg)';
                
                // Wait for transform transition before changing the icon
                setTimeout(() => {
                    this.innerHTML = '<i class="ri-menu-line"></i>';
                    this.style.transform = 'rotate(0deg)';
                }, 150);
                
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navbar.contains(e.target) && e.target !== mobileMenuBtn) {
                isMenuOpen = false;
                navbar.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="ri-menu-line"></i>';
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMenuOpen && window.innerWidth <= 768) {
                    isMenuOpen = false;
                    navbar.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="ri-menu-line"></i>';
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // Add CSS for no products message
    const style = document.createElement('style');
    style.textContent = `
        .no-products-message {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px 20px;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 16px;
            animation: fadeIn 0.5s ease forwards;
        }
        
        .no-products-message p {
            font-size: 1.1rem;
            color: #555;
            margin-bottom: 15px;
        }
        
        .reset-filter {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .reset-filter:hover {
            background: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll with mobile-friendly behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Get header height for offset (account for floating navbar)
            const headerHeight = document.querySelector('nav').offsetHeight + 20;
            
            // Smooth scroll to target with header offset
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    });
}); 