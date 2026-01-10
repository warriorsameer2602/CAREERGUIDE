// Home Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all homepage functions
    initHeroAnimations();
    initFeatureAnimations();
    initDemoTabs();
    initScrollEffects();
    initCounters();
    initInteractiveElements();
    initSuccessStories();
});

// Hero Section Animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const floatingCards = document.querySelectorAll('.card');
    
    // Floating cards interaction
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.zIndex = '1';
        });
        
        // Add click handler for cards
        card.addEventListener('click', () => {
            const cardText = card.querySelector('span').textContent;
            handleCardClick(cardText);
        });
        
        // Random subtle movement for cards
        setInterval(() => {
            if (!card.matches(':hover')) {
                const randomX = Math.random() * 5 - 2.5;
                const randomY = Math.random() * 5 - 2.5;
                card.style.transform += ` translate(${randomX}px, ${randomY}px)`;
            }
        }, 4000 + index * 800);
    });
}

function handleCardClick(cardType) {
    const routes = {
        'Engineering': '/career?field=engineering',
        'Medical': '/career?field=medical',
        'Arts': '/career?field=arts',
        'Commerce': '/career?field=commerce',
        'Technology': '/career?field=technology'
    };
    
    if (routes[cardType]) {
        window.location.href = routes[cardType];
    }
}

// Feature Cards Animation
function initFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    featureCards.forEach(card => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        observer.observe(card);
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('animate-in')) {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Demo Tab Functionality
function initDemoTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Track analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'demo_tab_click', {
                    'tab_name': targetTab
                });
            }
        });
    });
    
    // Demo quiz functionality
    const quizOptions = document.querySelectorAll('input[name="demo-q1"]');
    const demoBtn = document.querySelector('.demo-btn');
    
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="demo-q1"]:checked');
            
            if (selectedOption) {
                showQuizResult(selectedOption.value);
            } else {
                showNotification('Please select an option first!', 'warning');
            }
        });
    }
    
    // College search demo
    const searchBtn = document.querySelector('.search-btn');
    const locationInput = document.querySelector('.location-input');
    
    if (searchBtn && locationInput) {
        searchBtn.addEventListener('click', () => {
            const location = locationInput.value.trim();
            if (location) {
                simulateCollegeSearch(location);
            } else {
                showNotification('Please enter a location first!', 'warning');
            }
        });
        
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

function showQuizResult(selectedValue) {
    const resultMap = {
        creative: {
            title: 'Creative Arts & Design',
            message: 'Arts, Design, and Creative fields would be perfect for you!',
            redirect: '/career?field=arts'
        },
        analytical: {
            title: 'Science & Engineering',
            message: 'Science, Engineering, and Technology fields match your interests!',
            redirect: '/career?field=engineering'
        },
        social: {
            title: 'Social Sciences & Humanities',
            message: 'Social Sciences, Teaching, and Human Services could be your calling!',
            redirect: '/career?field=social'
        }
    };
    
    const result = resultMap[selectedValue];
    if (result) {
        showResultModal(result.title, result.message, result.redirect);
    }
}

function showResultModal(title, message, redirectUrl) {
    const modal = createModal(title, message, [
        {
            text: 'Explore Careers',
            class: 'btn-primary',
            action: () => window.location.href = redirectUrl
        },
        {
            text: 'Take Full Quiz',
            class: 'btn-secondary',
            action: () => window.location.href = '/quiz'
        },
        {
            text: 'Close',
            class: 'btn-outline',
            action: 'close'
        }
    ]);
    
    document.body.appendChild(modal);
}

function simulateCollegeSearch(location) {
    const resultsDiv = document.querySelector('.college-results');
    const loadingHtml = `
        <div class="loading-animation">
            <div class="spinner"></div>
            <p style="color: white; margin-top: 1rem;">Searching colleges in ${location}...</p>
        </div>
    `;
    
    resultsDiv.innerHTML = loadingHtml;
    
    setTimeout(() => {
        const sampleResults = generateSampleColleges(location);
        resultsDiv.innerHTML = sampleResults;
        
        // Add click handlers to college items
        const collegeItems = resultsDiv.querySelectorAll('.college-item');
        collegeItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                window.location.href = '/colleges';
            });
        });
    }, 2000);
}

function generateSampleColleges(location) {
    const colleges = [
        {
            name: 'Government Engineering College',
            distance: '2.5 km',
            rating: '4.2',
            fees: '₹50,000/year',
            courses: 'B.Tech CSE, ECE, ME'
        },
        {
            name: 'Government Arts & Science College',
            distance: '1.8 km',
            rating: '4.0',
            fees: '₹15,000/year',
            courses: 'B.A., B.Sc., B.Com'
        },
        {
            name: 'State Medical College',
            distance: '5.2 km',
            rating: '4.5',
            fees: '₹25,000/year',
            courses: 'MBBS, BDS, B.Pharm'
        }
    ];
    
    return colleges.map(college => `
        <div class="college-item" style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; transition: all 0.3s ease;">
            <h4>${college.name}</h4>
            <p>📍 ${college.distance} away • ⭐ ${college.rating} rating • 💰 ${college.fees}</p>
            <small style="display: block; margin-top: 0.5rem; opacity: 0.8;">${college.courses} available</small>
        </div>
    `).join('');
}

// Scroll Effects
function initScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('#features').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effect for hero background
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Hide scroll indicator on scroll
    window.addEventListener('scroll', () => {
        if (scrollIndicator && window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Interactive Elements
function initInteractiveElements() {
    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
    
    // Social links tracking
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.querySelector('i').className.split(' ')[1].replace('fa-', '');
            
            // Track social click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_click', {
                    'platform': platform
                });
            }
            
            showNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} integration coming soon!`, 'info');
        });
    });
    
    // Feature button enhancements
    const featureBtns = document.querySelectorAll('.feature-btn');
    featureBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const featureName = this.parentElement.querySelector('h3').textContent;
            
            // Track feature click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'feature_click', {
                    'feature_name': featureName
                });
            }
        });
    });
}

function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
        // Simulate API call
        showNotification('Thank you for subscribing! You\'ll receive updates soon.', 'success');
        e.target.reset();
        
        // Track signup
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
                'method': 'homepage'
            });
        }
    } else {
        showNotification('Please enter a valid email address.', 'error');
    }
}

// Success Stories Animation
function initSuccessStories() {
    const storyCards = document.querySelectorAll('.story-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });
    
    storyCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
        
        // Add hover animation
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function createModal(title, message, buttons) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const buttonHTML = buttons.map(btn => 
        `<button class="${btn.class}" onclick="${btn.action === 'close' ? 'this.closest(\'.modal-overlay\').remove()' : ''}" data-action="${btn.action}">${btn.text}</button>`
    ).join('');
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 20px; text-align: center; max-width: 500px; margin: 20px; animation: slideInUp 0.3s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
            <h2 style="margin-bottom: 1rem; color: #1e293b;">${title}</h2>
            <p style="margin-bottom: 2rem; color: #64748b; line-height: 1.6;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                ${buttonHTML}
            </div>
        </div>
    `;
    
    // Add event listeners for custom actions
    modal.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-action') && e.target.getAttribute('data-action') !== 'close') {
            const action = buttons.find(btn => btn.text === e.target.textContent)?.action;
            if (typeof action === 'function') {
                action();
                modal.remove();
            }
        }
        
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .notification {
        font-family: 'Poppins', sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Homepage error:', e.error);
    if (process.env.NODE_ENV === 'development') {
        showNotification('A JavaScript error occurred. Check the console.', 'error');
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`🚀 Homepage loaded in ${Math.round(loadTime)}ms`);
    
    // Track page load time
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            'name': 'homepage_load',
            'value': Math.round(loadTime)
        });
    }
});
