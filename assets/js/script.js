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

// Improved mobile menu toggle with better event handling
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');
let isMenuOpen = false;

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        isMenuOpen = !isMenuOpen;
        navbar.classList.toggle('active');
        
        // Change icon when menu is opened/closed
        if (isMenuOpen) {
            this.innerHTML = '<i class="ri-close-line"></i>';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            this.innerHTML = '<i class="ri-menu-line"></i>';
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

// Handle window resize to properly restore menu state on desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isMenuOpen) {
        isMenuOpen = false;
        navbar.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="ri-menu-line"></i>';
        document.body.style.overflow = '';
    }
});

// Improved modal for touch devices
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Add animation class
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Center the modal on mobile devices
        if (window.innerWidth <= 768) {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.marginTop = window.innerHeight * 0.1 + 'px';
            }
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Reset margin if it was adjusted for mobile
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.marginTop = '';
            }
        }, 300);
    }
}

function switchModal(currentModalId, newModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        openModal(newModalId);
    }, 300);
}

// Close modal when clicking outside of modal content
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            const modalId = modal.getAttribute('id');
            closeModal(modalId);
        }
    });
});

// Toggle password visibility
function togglePassword(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-off-line');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('ri-eye-off-line');
        icon.classList.add('ri-eye-line');
    }
}

// Form submission handling
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would normally send the data to your server
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        console.log('Login attempt:', { email, password });
        
        // For demo purposes, show success and close modal
        alert('Login successful!');
        closeModal('loginModal');
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would normally send the data to your server
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Simple validation for password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        console.log('Signup attempt:', { name, email, phone, password });
        
        // For demo purposes, show success and close modal
        alert('Account created successfully!');
        closeModal('signupModal');
    });
}

// Handle touch events for hero slider
function initHeroSlider() {
    const backgrounds = document.querySelectorAll('.hero-background');
    if (backgrounds.length <= 1) return;
    
    let currentIndex = 0;
    let startX = 0;
    let isSwiping = false;
    
    const heroSection = document.querySelector('.hero-section');
    
    function showNextImage() {
        backgrounds[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % backgrounds.length;
        backgrounds[currentIndex].classList.add('active');
    }
    
    function showPrevImage() {
        backgrounds[currentIndex].classList.remove('active');
        currentIndex = (currentIndex - 1 + backgrounds.length) % backgrounds.length;
        backgrounds[currentIndex].classList.add('active');
    }
    
    // Auto rotate every 5 seconds
    const interval = setInterval(showNextImage, 5000);
    
    // Add touch/swipe support
    if (heroSection) {
        heroSection.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            isSwiping = true;
            
            // Pause the auto rotation when user starts touching
            clearInterval(interval);
        }, { passive: true });
        
        heroSection.addEventListener('touchmove', function(e) {
            if (!isSwiping) return;
            
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            // Detect horizontal swipe
            if (Math.abs(diff) > 50) {
                isSwiping = false;
                
                if (diff > 0) {
                    // Swipe left, show next image
                    showNextImage();
                } else {
                    // Swipe right, show previous image
                    showPrevImage();
                }
            }
        }, { passive: true });
        
        heroSection.addEventListener('touchend', function() {
            isSwiping = false;
            
            // Resume auto rotation
            clearInterval(interval);
            setInterval(showNextImage, 5000);
        }, { passive: true });
    }
    
    return {
        next: showNextImage,
        prev: showPrevImage
    };
}

// Handle viewport height issues on mobile browsers
function setMobileHeight() {
    // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial height and update on resize
window.addEventListener('resize', setMobileHeight);
window.addEventListener('orientationchange', setMobileHeight);

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial viewport height
    setMobileHeight();
    
    // Other initialization code...
    
    // Initialize hero slider
    const heroSlider = initHeroSlider();
    
    // Smooth scroll with mobile-friendly behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Get header height for offset
            const headerHeight = document.querySelector('nav').offsetHeight;
            
            // Smooth scroll to target with header offset
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal[style*="display: block"]');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });

    // Initialize UI forms
    initializeForms();
    
    // Make sure the copyright is always at the bottom on mobile
    function adjustFooter() {
        const body = document.body;
        const html = document.documentElement;
        
        const documentHeight = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        
        // If the page content is less than viewport, push footer to bottom
        if (documentHeight <= window.innerHeight) {
            document.querySelector('footer').style.marginTop = 'auto';
        } else {
            document.querySelector('footer').style.marginTop = '';
        }
    }
    
    // Run initially and on window resize
    adjustFooter();
    window.addEventListener('resize', adjustFooter);

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
});

// Form initialization function to avoid variable redeclaration
function initializeForms() {
    // Form submission handling with improved mobile validation
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally send the data to your server
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            console.log('Login attempt:', { email, password });
            
            // For demo purposes, show success and close modal
            alert('Login successful!');
            closeModal('loginModal');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally send the data to your server
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (!name || !email || !phone || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simple validation for password match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            console.log('Signup attempt:', { name, email, phone, password });
            
            // For demo purposes, show success and close modal
            alert('Account created successfully!');
            closeModal('signupModal');
        });
    }
}

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
