/**
 * Royal Luxury - Main JavaScript File
 * Provides interactive functionality for the luxury website
 * Features: Smooth scrolling, animations, gallery filtering, form enhancements
 */

(function() {
    'use strict';

    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        initializeWebsite();
    });

    /**
     * Initialize all website functionality
     */
    function initializeWebsite() {
        initSmoothScrolling();
        initScrollAnimations();
        initNavigationEffects();
        initGalleryFiltering();
        initFormEnhancements();
        initLoadingAnimations();
        initMobileMenu();
        initScrollToTop();
        initParallaxEffects();
        initCounterAnimations();
        initTooltips();
    }

    /**
     * Smooth Scrolling for Navigation Links
     */
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just '#'
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const navbarHeight = document.querySelector('.royal-navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const toggleButton = document.querySelector('.navbar-toggler');
                        toggleButton.click();
                    }
                }
            });
        });

        // Smooth scroll for scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const nextSection = document.querySelector('.features-section') ||
                                  document.querySelector('section:nth-of-type(2)');
                if (nextSection) {
                    const navbarHeight = document.querySelector('.royal-navbar').offsetHeight;
                    window.scrollTo({
                        top: nextSection.offsetTop - navbarHeight,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    /**
     * Scroll Animations for Elements
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.feature-card, .service-card, .value-card, .team-card, ' +
            '.gallery-card, .contact-info-card, .award-card, .process-step, ' +
            '.service-detail-card, .additional-service-card'
        );

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(element);
        });
    }

    /**
     * Navigation Effects and Active State
     */
    function initNavigationEffects() {
        const navbar = document.querySelector('.royal-navbar');
        const navLinks = document.querySelectorAll('.royal-nav-link');

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'linear-gradient(135deg, rgba(48, 25, 52, 0.95) 0%, rgba(75, 0, 130, 0.95) 100%)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'linear-gradient(135deg, var(--deep-purple) 0%, var(--royal-purple) 100%)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });

        // Active navigation state
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id], .hero-section');
            const scrollPos = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id') || 'home';

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}` ||
                            (sectionId === 'home' && link.getAttribute('href') === '/')) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    }

    /**
     * Enhanced Gallery Filtering
     */
    function initGalleryFiltering() {
        const filterBtns = document.querySelectorAll('.gallery-filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active filter button with animation
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.transform = 'scale(1)';
                });
                this.classList.add('active');
                this.style.transform = 'scale(1.05)';

                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                // Filter gallery items with staggered animation
                galleryItems.forEach((item, index) => {
                    const category = item.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;

                    if (shouldShow) {
                        setTimeout(() => {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        }, index * 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    /**
     * Form Enhancements
     */
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('.royal-input');

        // Input focus effects
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            const icon = formGroup ? formGroup.querySelector('.form-icon') : null;

            input.addEventListener('focus', function() {
                if (icon) {
                    icon.style.color = 'var(--royal-gold)';
                    icon.style.transform = 'scale(1.1)';
                }
                this.style.borderColor = 'var(--royal-gold)';
            });

            input.addEventListener('blur', function() {
                if (icon) {
                    icon.style.color = '';
                    icon.style.transform = 'scale(1)';
                }
                if (!this.value) {
                    this.style.borderColor = '';
                }
            });

            input.addEventListener('input', function() {
                if (this.value) {
                    this.style.borderColor = 'var(--royal-gold)';
                }
            });
        });

        // Form submission enhancement
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
                    submitBtn.disabled = true;

                    // Re-enable after 3 seconds (in case of redirect)
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }
            });
        });

        // Real-time validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.style.borderColor = '#dc3545';
                    showTooltip(this, 'Please enter a valid email address');
                } else {
                    this.style.borderColor = 'var(--royal-gold)';
                    hideTooltip(this);
                }
            });
        });
    }

    /**
     * Loading Animations
     */
    function initLoadingAnimations() {
        // Page load animation
        window.addEventListener('load', function() {
            document.body.classList.add('loaded');

            // Animate hero elements
            const heroElements = document.querySelectorAll('.animate-fade-up, .animate-fade-up-delay, .animate-fade-up-delay-2');
            heroElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });

        // Image lazy loading simulation
        const imagePlaceholders = document.querySelectorAll('.gallery-image-placeholder, .about-image-placeholder, .team-image-placeholder');
        imagePlaceholders.forEach(placeholder => {
            placeholder.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });

            placeholder.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Mobile Menu Enhancements
     */
    function initMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (!navbarToggler || !navbarCollapse) return;

        navbarToggler.addEventListener('click', function() {
            setTimeout(() => {
                if (navbarCollapse.classList.contains('show')) {
                    // Menu is opening
                    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
                    navLinks.forEach((link, index) => {
                        link.style.opacity = '0';
                        link.style.transform = 'translateX(20px)';
                        setTimeout(() => {
                            link.style.opacity = '1';
                            link.style.transform = 'translateX(0)';
                            link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        }, index * 100);
                    });
                }
            }, 100);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    }

    /**
     * Scroll to Top Functionality
     */
    function initScrollToTop() {
        // Create scroll to top button
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '<i class="fas fa-crown"></i>';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

        // Style the button
        Object.assign(scrollToTopBtn.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--royal-gold) 0%, #FFA500 100%)',
            color: 'var(--elegant-black)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            zIndex: '1000',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
        });

        document.body.appendChild(scrollToTopBtn);

        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effects
        scrollToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
        });

        scrollToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
        });
    }

    /**
     * Parallax Effects for Hero Section
     */
    function initParallaxEffects() {
        const heroSection = document.querySelector('.hero-section');
        const pageHeader = document.querySelector('.page-header');

        if (heroSection || pageHeader) {
            window.addEventListener('scroll', throttle(function() {
                const scrolled = window.pageYOffset;
                const parallaxElement = heroSection || pageHeader;
                const rate = scrolled * -0.5;

                if (parallaxElement) {
                    parallaxElement.style.transform = `translateY(${rate}px)`;
                }
            }, 16));
        }
    }

    /**
     * Counter Animations for Statistics
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');

        const observerOptions = {
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/\D/g, ''));
                    const suffix = counter.textContent.replace(/[0-9]/g, '');

                    animateCounter(counter, 0, target, 2000, suffix);
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    /**
     * Animate Counter Numbers
     */
    function animateCounter(element, start, end, duration, suffix) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(function() {
            current += increment;
            element.textContent = current + suffix;

            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    /**
     * Tooltip System
     */
    function initTooltips() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function(tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

    /**
     * Show Custom Tooltip
     */
    function showTooltip(element, message) {
        hideTooltip(element); // Remove any existing tooltip

        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = message;

        Object.assign(tooltip.style, {
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#dc3545',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            zIndex: '1000',
            marginBottom: '5px',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        const formGroup = element.closest('.form-group');
        if (formGroup) {
            formGroup.style.position = 'relative';
            formGroup.appendChild(tooltip);

            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
        }
    }

    /**
     * Hide Custom Tooltip
     */
    function hideTooltip(element) {
        const formGroup = element.closest('.form-group');
        if (formGroup) {
            const existingTooltip = formGroup.querySelector('.custom-tooltip');
            if (existingTooltip) {
                existingTooltip.style.opacity = '0';
                setTimeout(() => {
                    existingTooltip.remove();
                }, 300);
            }
        }
    }

    /**
     * Throttle Function for Performance
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce Function for Performance
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Utility: Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Handle Flash Messages Auto-Dismiss
     */
    function initFlashMessages() {
        const flashMessages = document.querySelectorAll('.flash-messages .alert');

        flashMessages.forEach(message => {
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                const alertInstance = bootstrap.Alert.getInstance(message) || new bootstrap.Alert(message);
                alertInstance.close();
            }, 5000);
        });
    }

    // Initialize flash messages
    initFlashMessages();

    /**
     * Keyboard Navigation Support
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) {
                    const toggleButton = document.querySelector('.navbar-toggler');
                    if (toggleButton) toggleButton.click();
                }
            }
        });
    }

    // Initialize keyboard navigation
    initKeyboardNavigation();

    /**
     * Preload Critical Resources
     */
    function preloadCriticalResources() {
        // Preload Google Fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap';
        fontLink.as = 'style';
        fontLink.onload = function() {
            this.onload = null;
            this.rel = 'stylesheet';
        };
        document.head.appendChild(fontLink);
    }

    // Preload resources
    preloadCriticalResources();

    /**
     * Performance Monitoring
     */
    function initPerformanceMonitoring() {
        // Log page load time
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Royal Luxury - Page loaded in ${pageLoadTime}ms`);
            }, 100);
        });
    }

    // Initialize performance monitoring
    initPerformanceMonitoring();

})();
