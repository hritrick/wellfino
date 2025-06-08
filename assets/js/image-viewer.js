/**
 * Mobile Image Viewer with Zoom Functionality
 * Enables full-screen viewing and pinch-to-zoom for product images on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create the image viewer modal elements
    const viewerModal = document.createElement('div');
    viewerModal.className = 'image-viewer-modal';
    viewerModal.innerHTML = `
        <div class="image-viewer-container">
            <div class="image-viewer-content">
                <img src="" alt="Product Image" class="viewer-image">
            </div>
            <button class="close-viewer" aria-label="Close image viewer">
                <i class="ri-close-line"></i>
            </button>
        </div>
    `;
    document.body.appendChild(viewerModal);

    // Get references to the viewer elements
    const viewerImage = viewerModal.querySelector('.viewer-image');
    const closeButton = viewerModal.querySelector('.close-viewer');
    
    // Find all product images that should be viewable
    const productImages = document.querySelectorAll('.product-detail-image img');
    
    // Find all visual aid images in the product description
    const visualAidImages = document.querySelectorAll('.product-detail-description img[src*="va.jpeg"]');
    
    // Initialize variables for touch handling
    let currentScale = 1;
    let startDistance = 0;
    let initialScale = 1;
    let posX = 0;
    let posY = 0;
    let startX = 0;
    let startY = 0;
    
    // Add click event to product images to open the viewer
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            // Set the image source in the viewer
            viewerImage.src = this.src;
            viewerImage.alt = this.alt;
            
            // Reset zoom and position
            resetZoom();
            
            // Show the modal
            viewerModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Add click event to visual aid images to open the viewer
    visualAidImages.forEach(img => {
        img.classList.add('zoomable-image'); // Add a class for styling
        img.addEventListener('click', function() {
            // Set the image source in the viewer
            viewerImage.src = this.src;
            viewerImage.alt = this.alt;
            
            // Reset zoom and position
            resetZoom();
            
            // Show the modal
            viewerModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close the viewer when clicking the close button
    closeButton.addEventListener('click', function() {
        viewerModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close the viewer when clicking outside the image
    viewerModal.addEventListener('click', function(e) {
        if (e.target === viewerModal) {
            viewerModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle pinch zoom gestures
    viewerImage.addEventListener('touchstart', handleTouchStart, false);
    viewerImage.addEventListener('touchmove', handleTouchMove, false);
    viewerImage.addEventListener('touchend', handleTouchEnd, false);
    
    // Double tap to zoom in/out
    let lastTap = 0;
    viewerImage.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected
            if (currentScale === 1) {
                // Zoom in to 2x
                setZoom(2, e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2, 
                       e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
            } else {
                // Reset zoom
                resetZoom();
            }
            e.preventDefault();
        }
        lastTap = currentTime;
    });
    
    // Touch handlers for pinch zoom
    function handleTouchStart(e) {
        e.preventDefault();
        
        if (e.touches.length === 2) {
            // Pinch gesture started - calculate initial distance
            startDistance = getDistance(e.touches[0], e.touches[1]);
            initialScale = currentScale;
        } else if (e.touches.length === 1) {
            // Single touch - prepare for panning
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
        }
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 2) {
            // Handle pinch zoom
            const distance = getDistance(e.touches[0], e.touches[1]);
            const scale = Math.min(Math.max(initialScale * (distance / startDistance), 1), 4);
            
            // Apply the new scale
            currentScale = scale;
            viewerImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        } else if (e.touches.length === 1 && currentScale > 1) {
            // Handle panning when zoomed in
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
            
            // Apply the new position
            viewerImage.style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
        }
    }
    
    function handleTouchEnd(e) {
        // Limit panning to prevent image from going too far off-screen
        if (currentScale > 1) {
            const maxPanX = (currentScale - 1) * viewerImage.width / 2;
            const maxPanY = (currentScale - 1) * viewerImage.height / 2;
            
            posX = Math.min(Math.max(posX, -maxPanX), maxPanX);
            posY = Math.min(Math.max(posY, -maxPanY), maxPanY);
            
            viewerImage.style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
        }
    }
    
    // Helper function to calculate distance between two touch points
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Set zoom centered on a specific point
    function setZoom(scale, centerX, centerY) {
        currentScale = scale;
        
        // Calculate position to keep the zoom centered on touch point
        if (scale > 1) {
            const rect = viewerImage.getBoundingClientRect();
            const imgCenterX = rect.left + rect.width / 2;
            const imgCenterY = rect.top + rect.height / 2;
            
            // Calculate offset based on where the user tapped relative to center
            posX = (imgCenterX - centerX) * (scale - 1) / scale;
            posY = (imgCenterY - centerY) * (scale - 1) / scale;
        } else {
            posX = 0;
            posY = 0;
        }
        
        viewerImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }
    
    // Reset zoom and position
    function resetZoom() {
        currentScale = 1;
        posX = 0;
        posY = 0;
        viewerImage.style.transform = 'translate(0, 0) scale(1)';
    }
});