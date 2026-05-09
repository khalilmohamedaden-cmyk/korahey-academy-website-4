// ============================================
// LIQUID PILLS (Nav, Hero, Footer)
// ============================================
function setupPill(pillId, btnSelector) {
    const pill = document.getElementById(pillId);
    const btns = document.querySelectorAll(btnSelector);
    if (!pill) return;
    
    const update = (btn) => {
        pill.style.width = `${btn.offsetWidth}px`;
        pill.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
    };
    
    if (btns[0]) update(btns[0]);
    btns.forEach(btn => btn.addEventListener('mouseenter', () => update(btn)));
}

// ============================================
// HERO SLIDER - CLEAN PILL ABSORPTION
// ============================================
const slides = document.querySelectorAll('.hero-image-slider img');
const dots = document.querySelectorAll('.dot');
const movingPill = document.getElementById('hero-line');
const observerContainer = document.querySelector('.video-nav-observer');
let currentIdx = 0;
let autoInterval;

// Move the pill to the position of a specific dot
function movePillToDot(index) {
    if (!dots[index] || !movingPill || !observerContainer) return;
    
    // Get dot position relative to container
    const dotRect = dots[index].getBoundingClientRect();
    const containerRect = observerContainer.getBoundingClientRect();
    const dotCenter = (dotRect.left + dotRect.width / 2) - containerRect.left;
    const pillWidth = movingPill.offsetWidth;
    
    // Move pill to center over dot
    movingPill.style.left = `${dotCenter - (pillWidth / 2)}px`;
}

// Update hero image, dots, and pill position
function updateHero(index) {
    // Update images
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
    
    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
    
    // Move pill to new dot position
    movePillToDot(index);
    currentIdx = index;
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

// ============================================
// DYNAMIC ISLAND NAVIGATION
// ============================================
let lastScrollY = window.scrollY;
const nav = document.getElementById('navbar');

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ============================================
window.addEventListener('load', () => {
    // Setup liquid pills
    setupPill('nav-pill-bg', '.btn-auth');
    setupPill('hero-pill-bg', '.hero-btns-group .btn-hero');
    setupPill('footer-pill-bg', '.why-footer .btn-hero');
    
    // Initialize hero slider
    setTimeout(() => {
        updateHero(0);
    }, 100);
    
    // Start auto slideshow (changes every 6 seconds)
    autoInterval = setInterval(() => {
        updateHero((currentIdx + 1) % slides.length);
    }, 6000);
    
    // Observe all animated elements
    document.querySelectorAll('.reveal, .reveal-slide-up, .reveal-pop').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Setup smooth scroll
    setupSmoothScroll();
});

// ============================================
// DOT CLICK HANDLERS
// ============================================
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        // Reset auto interval when user clicks
        clearInterval(autoInterval);
        updateHero(i);
        // Restart auto cycle
        autoInterval = setInterval(() => {
            updateHero((currentIdx + 1) % slides.length);
        }, 6000);
    });
});

// ============================================
// SCROLL EVENT FOR DYNAMIC ISLAND NAV
// ============================================
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.classList.add('nav-hidden');
    } else {
        nav.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;
});

// ============================================
// REPOSITION PILL ON WINDOW RESIZE
// ============================================
window.addEventListener('resize', () => {
    movePillToDot(currentIdx);
});