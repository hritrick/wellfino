/**
 * Common JavaScript functionality for Wellfino website
 */

document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navbar = document.querySelector(".navbar");
    
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener("click", function() {
            navbar.classList.toggle("active");
        });
    }
    
    // Set active nav item based on current page
    const currentPage = window.location.pathname.split("/").pop();
    const navProducts = document.getElementById("nav-products");
    const navAbout = document.getElementById("nav-about");
    
    if (navProducts && navAbout) {
        if (currentPage === "products.html") {
            navProducts.classList.add("active");
        } else if (currentPage === "index.html" || currentPage === "") {
            // Only add active class to About if we're on the index page
            if (window.location.hash === "#about") {
                navAbout.classList.add("active");
            }
        }
    }
    
    // Scroll behavior for header
    const header = document.querySelector("header");
    
    if (header) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbar && navbar.classList.contains("active")) {
                    navbar.classList.remove("active");
                }
            }
        });
    });
}); 