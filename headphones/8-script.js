// Hamburger Menu Functionality
class HamburgerMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.header = document.querySelector('.header');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('click', (e) => this.handleClickOutside(e));
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle scroll for header background
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close menu when clicking on nav links
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.navMenu.classList.add('active');
        this.hamburger.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.isOpen = true;
        
        // Create overlay
        this.createOverlay();
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        
        // Add escape key listener
        this.escapeListener = (e) => {
            if (e.key === 'Escape') this.closeMenu();
        };
        document.addEventListener('keydown', this.escapeListener);
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.isOpen = false;
        
        // Remove overlay
        this.removeOverlay();
        
        // Enable body scroll
        document.body.style.overflow = '';
        
        // Remove escape key listener
        if (this.escapeListener) {
            document.removeEventListener('keydown', this.escapeListener);
        }
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'menu-overlay';
        this.overlay.addEventListener('click', () => this.closeMenu());
        document.body.appendChild(this.overlay);
        
        // Trigger animation
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 10);
    }
    
    removeOverlay() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
            }, 300);
        }
    }
    
    handleKeydown(e) {
        // Tab key navigation when menu is open
        if (this.isOpen && e.key === 'Tab') {
            const focusableElements = this.navMenu.querySelectorAll('a[href], button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    handleClickOutside(e) {
        if (this.isOpen && 
            !this.navMenu.contains(e.target) && 
            !this.hamburger.contains(e.target) &&
            (!this.overlay || !this.overlay.contains(e.target))) {
            this.closeMenu();
        }
    }
    
    handleResize() {
        // Close menu and remove overlay if window is resized to desktop size
        if (window.innerWidth > 480 && this.isOpen) {
            this.closeMenu();
        }
    }
    
    handleScroll() {
        // Add scrolled class to header when scrolling
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hamburger menu
    new HamburgerMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add loading class to body for any initial animations
    document.body.classList.add('loaded');
});

// Handle page visibility changes (pause animations when not visible)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// Export for potential module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HamburgerMenu;
}
