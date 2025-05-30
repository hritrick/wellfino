// Mobile menu toggle and responsive behavior
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('header');
    let isMenuOpen = false;
    let lastScrollTop = 0;
    let scrollTimer;

    // Initial page load adjustments
    function initializePageLayout() {
        // Adjust hero section height to fill viewport
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.height = `${window.innerHeight}px`;
        }
    }

    // Run initialization
    initializePageLayout();

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
                    this.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease';
                    this.style.transform = 'rotate(90deg)';
                    this.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    
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
                this.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease';
                this.style.transform = 'rotate(-90deg)';
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                
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
                mobileMenuBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
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
                    mobileMenuBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    document.body.style.overflow = '';
                }
            });
        });
    }

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

    // Handle viewport height issues on mobile browsers
    function setMobileHeight() {
        // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
        const vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Also adjust hero section height if it exists
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.height = `${window.innerHeight}px`;
        }
    }

    // Initialize mobile height
    setMobileHeight();

    // Add resize event listener with debouncing for better performance
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Update viewport height variable for mobile browsers
            setMobileHeight();
            
            // Handle menu state on window resize
            if (window.innerWidth > 768 && isMenuOpen) {
                isMenuOpen = false;
                navbar.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="ri-menu-line"></i>';
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    // Add smooth animations to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .category-card, .product-card, .about-text, .about-features');
        
        elements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.animation = 'fadeUp 0.8s ease-out forwards';
            }
        });
    };
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
    // Initialize animations on page load
    setTimeout(animateOnScroll, 300);
    
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
