// Hero background rotation
let heroBackgroundRotation;

function initHeroBackgroundRotation() {
    const heroBackgrounds = document.querySelectorAll('.hero-background');
    let currentBackground = 0;

    function changeBackground() {
        // Remove active class from all backgrounds
        heroBackgrounds.forEach(bg => bg.classList.remove('active'));
        
        // Add active class to the next background
        currentBackground = (currentBackground + 1) % heroBackgrounds.length;
        heroBackgrounds[currentBackground].classList.add('active');
    }

    // Start the background rotation
    heroBackgroundRotation = setInterval(changeBackground, 2000);
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

function validatePhone(phone) {
    // 10 digits
    const re = /^\d{10}$/;
    return re.test(phone);
}

function showFormError(formId, message) {
    const form = document.getElementById(formId);
    let errorDiv = form.querySelector('.form-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.textAlign = 'center';
        form.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.opacity = '1';
}

function clearFormError(formId) {
    const errorDiv = document.getElementById(formId).querySelector('.form-error');
    if (errorDiv) {
        errorDiv.style.opacity = '0';
        errorDiv.textContent = '';
    }
}

function showLoadingState(button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<i class="ri-loader-4-line"></i> Processing...';
    button.style.opacity = '0.7';
    return originalText;
}

function resetButton(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '1';
}

// Notification system
function showNotification(message, type = 'success') {
    const container = document.querySelector('.notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        padding: 15px 25px;
        margin-bottom: 10px;
        border-radius: 8px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 0.95rem;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    container.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Auth UI update
function updateAuthUI(user) {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="user-button">
                    <i class="ri-user-line"></i>
                    ${user.name}
                </button>
                <button class="logout-btn" onclick="handleLogout()">
                    Logout
                </button>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="login-btn" onclick="openModal('loginModal')">LOGIN</button>
            <button class="signup-btn" onclick="openModal('signupModal')">SIGN UP</button>
        `;
    }
}

// Logout handler
async function handleLogout() {
    try {
        const API_URL = 'http://localhost:3000/api';
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        // Clear local storage and update UI
        localStorage.removeItem('user');
        updateAuthUI(null);
        window.location.reload();

    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function switchModal(fromModalId, toModalId) {
    closeModal(fromModalId);
    setTimeout(() => openModal(toModalId), 300);
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-off-line');
    } else {
        input.type = 'password';
        icon.classList.remove('ri-eye-off-line');
        icon.classList.add('ri-eye-line');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
    `;
    document.body.appendChild(notificationContainer);

    // Initialize UI
    const user = JSON.parse(localStorage.getItem('user'));
    updateAuthUI(user);

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearFormError('loginForm');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = showLoadingState(submitBtn);

            // Validate inputs
            if (!email || !password) {
                showFormError('loginForm', 'Please fill in all fields');
                resetButton(submitBtn, originalText);
                return;
            }

            if (!validateEmail(email)) {
                showFormError('loginForm', 'Please enter a valid email address');
                resetButton(submitBtn, originalText);
                return;
            }

            try {
                const API_URL = 'http://localhost:3000/api';
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, rememberMe }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                // Store user data
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Close modal and update UI
                closeModal('loginModal');
                updateAuthUI(data.user);
                
                // Redirect to dashboard or reload page
                window.location.reload();

            } catch (error) {
                showError('loginForm', error.message);
            } finally {
                resetButton(submitBtn, originalText);
            }
        });
    }

    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearFormError('signupForm');
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.getElementById('termsAccept').checked;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = showLoadingState(submitBtn);

            // Validate inputs
            if (!name || !email || !phone || !password || !confirmPassword) {
                showFormError('signupForm', 'Please fill in all fields');
                resetButton(submitBtn, originalText);
                return;
            }

            if (!validateEmail(email)) {
                showFormError('signupForm', 'Please enter a valid email address');
                resetButton(submitBtn, originalText);
                return;
            }

            if (!validatePhone(phone)) {
                showFormError('signupForm', 'Please enter a valid 10-digit phone number');
                resetButton(submitBtn, originalText);
                return;
            }

            if (!validatePassword(password)) {
                showFormError('signupForm', 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
                resetButton(submitBtn, originalText);
                return;
            }

            if (password !== confirmPassword) {
                showFormError('signupForm', 'Passwords do not match');
                resetButton(submitBtn, originalText);
                return;
            }

            if (!termsAccepted) {
                showFormError('signupForm', 'Please accept the Terms of Service');
                resetButton(submitBtn, originalText);
                return;
            }

            try {
                const API_URL = 'http://localhost:3000/api';
                const response = await fetch(`${API_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, password }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Signup failed');
                }

                // Store user data
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Close modal and update UI
                closeModal('signupModal');
                updateAuthUI(data.user);
                
                // Show success message and redirect
                alert('Account created successfully! Please log in.');
                openModal('loginModal');

            } catch (error) {
                showError('signupForm', error.message);
            } finally {
                resetButton(submitBtn, originalText);
            }
        });
    }

    // Navigation scroll effect
    const nav = document.querySelector('nav');
    const logo = document.querySelector('.logo-link img');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class to nav when scrolling down
        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Logo zoom animation based on scroll direction
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            logo.classList.add('logo-zoom-out');
            logo.classList.remove('logo-zoom-in');
        } else {
            // Scrolling up
            logo.classList.add('logo-zoom-in');
            logo.classList.remove('logo-zoom-out');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    let isMenuOpen = false;

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navbar.classList.toggle('active');
            mobileMenuBtn.innerHTML = isMenuOpen ? 
                '<i class="ri-close-line"></i>' : 
                '<i class="ri-menu-line"></i>';
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    navbar.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="ri-menu-line"></i>';
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Product Slider Functionality
    const container = document.querySelector('.categories-container');
    const productPrevBtn = document.querySelector('.categories-slider .prev-btn');
    const productNextBtn = document.querySelector('.categories-slider .next-btn');
    const productCards = document.querySelectorAll('.category-card');
    
    if (!container || !productPrevBtn || !productNextBtn) return;

    let currentPosition = 0;
    let isDragging = false;
    let startX;
    let scrollLeft;
    let touchStartX;
    let touchStartY;
    let touchEndX;

    const totalProducts = productCards.length;
    const productsPerFrame = 4;
    const totalFrames = Math.ceil(totalProducts / productsPerFrame);

    // Enable smooth scrolling
    container.style.cursor = 'grab';
    container.style.userSelect = 'none';
    container.style.overflow = 'hidden';
    container.style.scrollBehavior = 'smooth';

    function updateSliderPosition(scrollPosition = null) {
        // If a scroll position is provided, use it
        if (scrollPosition !== null) {
            container.scrollLeft = scrollPosition;
            return;
        }

        // Calculate the width of one card including gap
        const cardWidth = productCards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(container).gap);
        const slideAmount = (cardWidth + gap) * productsPerFrame;
        
        // Calculate translation for button clicks
        const scrollPosition = currentPosition * slideAmount;
        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Update button states
        const maxScroll = container.scrollWidth - container.clientWidth;
        productPrevBtn.style.opacity = container.scrollLeft <= 0 ? '0.5' : '1';
        productPrevBtn.style.pointerEvents = container.scrollLeft <= 0 ? 'none' : 'auto';
        
        productNextBtn.style.opacity = container.scrollLeft >= maxScroll ? '0.5' : '1';
        productNextBtn.style.pointerEvents = container.scrollLeft >= maxScroll ? 'none' : 'auto';
        
        // Update dots
        updateDots();
    }

    // Mouse events for drag scrolling
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        snapToNearestCard();
    });

    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
            snapToNearestCard();
        }
    });

    // Touch events
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        startX = e.touches[0].clientX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        
        const touchCurrentX = e.touches[0].clientX;
        const touchCurrentY = e.touches[0].clientY;
        const deltaX = touchStartX - touchCurrentX;
        const deltaY = touchStartY - touchCurrentY;

        // If scrolling horizontally, prevent vertical scrolling
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            container.scrollLeft = scrollLeft + deltaX;
        }
    });

    container.addEventListener('touchend', (e) => {
        touchStartX = null;
        snapToNearestCard();
    });

    // Snap to nearest card after scrolling
    function snapToNearestCard() {
        const cardWidth = productCards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(container).gap);
        const slideAmount = cardWidth + gap;
        
        const nearestCard = Math.round(container.scrollLeft / slideAmount);
        const targetScroll = nearestCard * slideAmount;
        
        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });

        // Update current position for dots
        currentPosition = Math.floor(nearestCard / productsPerFrame);
        updateDots();
    }

    // Handle next button click
    productNextBtn.addEventListener('click', () => {
        if (currentPosition < totalFrames - 1) {
            currentPosition++;
            updateSliderPosition();
        }
    });

    // Handle previous button click
    productPrevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateSliderPosition();
        }
    });

    // Create and update dots
    const dotsContainer = document.querySelector('.slider-dots');
    if (dotsContainer) {
        // Clear existing dots
        dotsContainer.innerHTML = '';
        
        // Create dots based on total frames
        for (let i = 0; i < totalFrames; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentPosition = i;
                updateSliderPosition();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPosition);
        });
    }

    // Initialize slider position and dots
    updateSliderPosition();

    // Update slider on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSliderPosition();
        }, 250);
    });

    // Update slider on scroll
    container.addEventListener('scroll', () => {
        const cardWidth = productCards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(container).gap);
        const slideAmount = (cardWidth + gap) * productsPerFrame;
        
        currentPosition = Math.round(container.scrollLeft / slideAmount);
        
        // Update button states and dots
        const maxScroll = container.scrollWidth - container.clientWidth;
        productPrevBtn.style.opacity = container.scrollLeft <= 0 ? '0.5' : '1';
        productPrevBtn.style.pointerEvents = container.scrollLeft <= 0 ? 'none' : 'auto';
        
        productNextBtn.style.opacity = container.scrollLeft >= maxScroll ? '0.5' : '1';
        productNextBtn.style.pointerEvents = container.scrollLeft >= maxScroll ? 'none' : 'auto';
        
        updateDots();
    });

    // Contact link smooth scroll
    const contactLink = document.querySelector('.contact-link');
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            const footer = document.getElementById('footer');
            if (footer) {
                // Close mobile menu if open
                const navbar = document.querySelector('.navbar');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (navbar && navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    document.body.style.overflow = '';
                    if (mobileMenuBtn) {
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('ri-close-line');
                            icon.classList.add('ri-menu-line');
                        }
                    }
                }

                // Smooth scroll to footer
                window.scrollTo({
                    top: footer.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    }

    // Categories Slider Functionality
    const categoriesContainer = document.querySelector('.categories-container');
    const prevBtn = document.querySelector('.categories-slider .prev-btn');
    const nextBtn = document.querySelector('.categories-slider .next-btn');

    if (categoriesContainer && prevBtn && nextBtn) {
        const cardWidth = categoriesContainer.querySelector('.category-card').offsetWidth;
        const gap = 30; // Gap between cards (matches CSS)
        const scrollAmount = cardWidth + gap;

        prevBtn.addEventListener('click', () => {
            categoriesContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            categoriesContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Hide/show buttons based on scroll position
        categoriesContainer.addEventListener('scroll', () => {
            const maxScroll = categoriesContainer.scrollWidth - categoriesContainer.clientWidth;
            
            prevBtn.style.opacity = categoriesContainer.scrollLeft <= 0 ? '0.5' : '1';
            nextBtn.style.opacity = categoriesContainer.scrollLeft >= maxScroll ? '0.5' : '1';
            
            prevBtn.style.pointerEvents = categoriesContainer.scrollLeft <= 0 ? 'none' : 'auto';
            nextBtn.style.pointerEvents = categoriesContainer.scrollLeft >= maxScroll ? 'none' : 'auto';
        });

        // Trigger scroll event initially to set button states
        categoriesContainer.dispatchEvent(new Event('scroll'));
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            // Close mobile menu if open
            if (navbar && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
                document.body.style.overflow = '';
            }

            // Calculate header height
            const headerHeight = document.querySelector('nav').offsetHeight;
            
            // Smooth scroll to target
            const targetPosition = targetElement.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Update active state of navigation links based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for header
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Hero Background Slideshow
    function initHeroSlideshow() {
        const backgrounds = document.querySelectorAll('.hero-background');
        if (!backgrounds.length) return;

        let currentIndex = 0;
        const interval = 5000; // Change background every 5 seconds

        function switchBackground() {
            // Remove active class from all backgrounds
            backgrounds.forEach(bg => bg.classList.remove('active'));
            
            // Add active class to next background
            currentIndex = (currentIndex + 1) % backgrounds.length;
            backgrounds[currentIndex].classList.add('active');
        }

        // Start the slideshow
        setInterval(switchBackground, interval);
    }

    // Initialize hero slideshow
    initHeroSlideshow();
});

// Show error message
function showError(formId, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.opacity = '1';
    errorDiv.textContent = message;
    
    const form = document.getElementById(formId);
    const existingError = form.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    form.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.style.opacity = '0';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Show loading state
function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        const originalText = button.textContent;
        button.setAttribute('data-original-text', originalText);
        button.innerHTML = '<i class="ri-loader-4-line"></i> Please wait...';
    } else {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        button.textContent = originalText;
    }
}

// Check auth state on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    updateAuthUI(user);
});
