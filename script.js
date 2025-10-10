// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards, gallery items, and other elements
    const animatedElements = document.querySelectorAll('.feature-card, .gallery-item, .use-case, .privacy-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize GIF placeholders with hover effects
    initializeGifPlaceholders();

    // Add click effects to buttons
    addButtonEffects();

    // Initialize contact form if exists
    initializeContactForm();

    // Initialize stats counter animation
    initializeStatsCounter();
});


// Initialize GIF Placeholders
function initializeGifPlaceholders() {
    const gifPlaceholders = document.querySelectorAll('.gif-placeholder');

    gifPlaceholders.forEach((placeholder, index) => {
        // Add hover effects
        placeholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });

        placeholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // Add click effect to show "loading" state
        placeholder.addEventListener('click', function() {
            const originalContent = this.innerHTML;
            this.innerHTML = `
                <div class="loading"></div>
                <p>Loading GIF...</p>
                <span>Preparing demonstration</span>
            `;

            // Simulate loading for demo purposes
            setTimeout(() => {
                this.innerHTML = originalContent;
                showNotification('GIF placeholder clicked! Replace with actual GIF files.');
            }, 2000);
        });

        // Add unique background gradients
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];

        placeholder.style.background = gradients[index % gradients.length];
    });
}

// Add Button Effects
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize Contact Form
function initializeContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
        });
    }
}

// Initialize Stats Counter Animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (target === '100%') {
                element.textContent = Math.round(current) + '%';
            } else if (target === 'Free') {
                element.textContent = 'Free';
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    };

    // Observe stats section
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent;

                if (text === '9') {
                    animateCounter(statNumber, 9);
                } else if (text === '100%') {
                    animateCounter(statNumber, 100);
                } else if (text === 'Free') {
                    statNumber.textContent = 'Free';
                }

                statsObserver.unobserve(statNumber);
            }
        });
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : '#4CAF50'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Feature Highlight System
function highlightFeature(featureId) {
    const feature = document.getElementById(featureId);
    if (feature) {
        feature.scrollIntoView({ behavior: 'smooth', block: 'center' });
        feature.style.animation = 'pulse 2s ease-in-out';

        setTimeout(() => {
            feature.style.animation = '';
        }, 2000);
    }
}

// Add pulse animation CSS
if (!document.querySelector('#pulse-styles')) {
    const style = document.createElement('style');
    style.id = 'pulse-styles';
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(76, 175, 80, 0.4); }
        }
    `;
    document.head.appendChild(style);
}

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Arrow keys for navigation (future feature)
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        const sections = document.querySelectorAll('section');
        // Implementation for section navigation
    }
});

// Performance Monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perf = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perf.loadEventEnd - perf.loadEventStart + 'ms');
            }, 0);
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Future: Register service worker for offline functionality
        console.log('Service Worker support detected');
    });
}

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get random gradient
    getRandomGradient() {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }
};

// Export utils for potential future use
window.ScreenBugsUtils = utils;

// Interactive Bug System
class BugSimulator {
    constructor() {
        this.bugs = [];
        this.bugCounter = 0;
        this.isActive = false;
        this.init();
    }

    init() {
        this.createBugControls();
        this.bindEvents();
        this.isActive = true;
    }

    createBugControls() {
        const controlsHTML = `
            <div class="bug-controls" id="bug-controls">
                <h4>🐛 Bug Demo</h4>
                <div class="bug-counter">
                    Active Bugs: <span id="bug-count">0</span>
                </div>
                <button class="bug-spawn-btn" data-bug="cockroach">
                    🪳 Spawn Cockroach
                </button>
                <button class="bug-spawn-btn" data-bug="moth">
                    🦋 Spawn Moth
                </button>
                <button class="bug-spawn-btn" data-bug="caterpillar">
                    🐛 Spawn Caterpillar
                </button>
                <button class="bug-spawn-btn clear-bugs-btn" id="clear-bugs">
                    🗑️ Clear All Bugs
                </button>
                <div style="font-size: 0.8rem; text-align: center; margin-top: 0.5rem; color: #666;">
                    Click bugs to squash them!
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', controlsHTML);
    }

    bindEvents() {
        // Spawn bug buttons
        document.querySelectorAll('.bug-spawn-btn[data-bug]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bugType = e.target.dataset.bug;
                this.spawnBug(bugType);
                showNotification(`${bugType.charAt(0).toUpperCase() + bugType.slice(1)} spawned!`);
            });
        });

        // Clear all bugs
        document.getElementById('clear-bugs').addEventListener('click', () => {
            this.clearAllBugs();
            showNotification('All bugs cleared!');
        });

        // Auto spawn for demo
        this.startAutoSpawn();
    }

    spawnBug(type) {
        const bug = this.createBugElement(type);
        document.body.appendChild(bug);
        this.bugs.push(bug);
        this.updateBugCounter();
        this.animateBug(bug, type);
    }

    createBugElement(type) {
        const bug = document.createElement('div');
        bug.className = `bug ${type}`;
        bug.dataset.bugType = type;

        // Set random starting position (ensure within viewport bounds)
        const startSide = Math.random() < 0.5 ? 'left' : 'top';
        if (startSide === 'left') {
            bug.style.left = '-60px';
            bug.style.top = Math.max(80, Math.min(window.innerHeight - 120, Math.random() * (window.innerHeight - 200))) + 'px';
        } else {
            bug.style.left = Math.max(0, Math.min(window.innerWidth - 60, Math.random() * (window.innerWidth - 100))) + 'px';
            bug.style.top = '-60px';
        }

        // Add bug structure based on type
        switch(type) {
            case 'cockroach':
                bug.innerHTML = `
                    <div class="body"></div>
                    <div class="head"></div>
                `;
                break;
            case 'moth':
                bug.innerHTML = `
                    <div class="wing-left"></div>
                    <div class="wing-right"></div>
                    <div class="body"></div>
                    <div class="antennae"></div>
                `;
                break;
            case 'caterpillar':
                bug.innerHTML = `
                    <div class="segment"></div>
                    <div class="segment"></div>
                    <div class="segment"></div>
                    <div class="segment"></div>
                    <div class="segment"></div>
                    <div class="head"></div>
                `;
                break;
        }

        // Add click to squash functionality
        bug.addEventListener('click', (e) => {
            e.preventDefault();
            this.squashBug(bug);
        });

        return bug;
    }

    animateBug(bug, type) {
        const movements = {
            cockroach: ['crawlStraight', 'crawlRandom'],
            moth: ['flyErratic'],
            caterpillar: ['crawlStraight']
        };

        const movement = movements[type][Math.floor(Math.random() * movements[type].length)];
        const duration = Math.random() * 10 + 8; // 8-18 seconds

        bug.style.animation = `${movement} ${duration}s linear infinite`;

        // Random direction changes for more realistic movement
        if (type === 'cockroach' && Math.random() < 0.3) {
            setTimeout(() => {
                bug.style.animation = `crawlRandom ${duration * 0.7}s linear infinite`;
            }, duration * 1000 * 0.3);
        }

        // Remove bug when it goes off screen
        setTimeout(() => {
            if (bug.parentNode && !bug.classList.contains('squashed')) {
                this.removeBug(bug);
            }
        }, duration * 1000);
    }

    squashBug(bug) {
        if (bug.classList.contains('squashed')) return;

        bug.classList.add('squashed');
        bug.style.animation = 'squash 0.3s ease forwards';

        // Add splat effect
        const splat = document.createElement('div');
        splat.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #8b4513 0%, #654321 70%, transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 998;
        `;
        bug.appendChild(splat);

        // Show squash sound effect (visual)
        showNotification('SQUASH! 💥', 'success');

        setTimeout(() => {
            this.removeBug(bug);
        }, 300);
    }

    removeBug(bug) {
        const index = this.bugs.indexOf(bug);
        if (index > -1) {
            this.bugs.splice(index, 1);
            bug.remove();
            this.updateBugCounter();
        }
    }

    clearAllBugs() {
        this.bugs.forEach(bug => {
            bug.remove();
        });
        this.bugs = [];
        this.updateBugCounter();
    }

    updateBugCounter() {
        const counter = document.getElementById('bug-count');
        if (counter) {
            counter.textContent = this.bugs.length;
        }
    }

    startAutoSpawn() {
        // Auto-spawn a bug every 15-30 seconds for demo
        setInterval(() => {
            if (this.bugs.length < 5) { // Max 5 bugs at once
                const bugTypes = ['cockroach', 'moth', 'caterpillar'];
                const randomType = bugTypes[Math.floor(Math.random() * bugTypes.length)];
                this.spawnBug(randomType);
            }
        }, Math.random() * 15000 + 15000); // 15-30 seconds
    }

    // Special effects for specific sections
    spawnInSection(sectionId, bugType, count = 1) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const rect = section.getBoundingClientRect();

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const bug = this.createBugElement(bugType);

                // Ensure bugs stay within safe bounds
                const safeLeft = Math.max(0, Math.min(window.innerWidth - 60, rect.left + Math.random() * Math.max(100, rect.width - 60)));
                const safeTop = Math.max(80, Math.min(window.innerHeight - 120, rect.top + window.scrollY + Math.random() * Math.max(50, rect.height - 60)));

                bug.style.left = safeLeft + 'px';
                bug.style.top = safeTop + 'px';

                document.body.appendChild(bug);
                this.bugs.push(bug);
                this.updateBugCounter();

                // Shorter animation for section demos
                bug.style.animation = `wiggle 2s ease-in-out infinite`;

                // Remove after 10 seconds
                setTimeout(() => {
                    if (bug.parentNode && !bug.classList.contains('squashed')) {
                        this.removeBug(bug);
                    }
                }, 10000);

            }, i * 500); // Stagger spawning
        }
    }
}

// Initialize Bug Simulator when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the page to settle
    setTimeout(() => {
        window.bugSimulator = new BugSimulator();

        // Add special effects to feature sections
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                if (Math.random() < 0.3) { // 30% chance
                    const bugTypes = ['cockroach', 'moth', 'caterpillar'];
                    const randomType = bugTypes[Math.floor(Math.random() * bugTypes.length)];
                    window.bugSimulator.spawnInSection(this.id || 'features', randomType, 1);
                }
            });
        });

        // Special gallery effects
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                window.bugSimulator.spawnInSection('gallery', 'moth', 2);
                showNotification('Moths attracted to the gallery! 🦋');
            });
        });

    }, 2000); // Start after 2 seconds
});

// Enhanced GIF placeholder interactions
function initializeGifPlaceholders() {
    const gifPlaceholders = document.querySelectorAll('.gif-placeholder');

    gifPlaceholders.forEach((placeholder, index) => {
        // Add hover effects
        placeholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';

            // Spawn a bug on hover
            if (window.bugSimulator && Math.random() < 0.4) {
                const bugTypes = ['cockroach', 'moth', 'caterpillar'];
                const randomType = bugTypes[index % bugTypes.length];

                // Get placeholder position (ensure safe bounds)
                const rect = this.getBoundingClientRect();
                const bug = window.bugSimulator.createBugElement(randomType);

                const safeLeft = Math.max(0, Math.min(window.innerWidth - 60, rect.left + rect.width + 10));
                const safeTop = Math.max(80, Math.min(window.innerHeight - 120, rect.top + window.scrollY + rect.height / 2));

                bug.style.left = safeLeft + 'px';
                bug.style.top = safeTop + 'px';

                document.body.appendChild(bug);
                window.bugSimulator.bugs.push(bug);
                window.bugSimulator.updateBugCounter();

                // Make it crawl away
                bug.style.animation = 'crawlStraight 5s linear forwards';
                setTimeout(() => {
                    if (bug.parentNode) {
                        window.bugSimulator.removeBug(bug);
                    }
                }, 5000);
            }
        });

        placeholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // Enhanced click effect
        placeholder.addEventListener('click', function() {
            const originalContent = this.innerHTML;
            this.innerHTML = `
                <div class="loading"></div>
                <p>Loading GIF...</p>
                <span>Preparing demonstration</span>
            `;

            // Spawn multiple bugs during loading
            if (window.bugSimulator) {
                setTimeout(() => {
                    window.bugSimulator.spawnInSection('gallery', 'cockroach', 3);
                }, 500);
            }

            setTimeout(() => {
                this.innerHTML = originalContent;
                showNotification('GIF placeholder clicked! Replace with actual GIF files.');
            }, 2000);
        });
    });
}