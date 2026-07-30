const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = !window.matchMedia('(hover: hover)').matches;

// --- Page Load Intro ---
window.addEventListener('load', function() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => loader.classList.add('loaded'), 350);
    }
});

// --- Typewriter Subtitle ---
const typewriterEl = document.getElementById('typewriter');
const typewriterWords = ['AI Enthusiast.', 'Robotics Builder.', 'Author.', 'Curious Coder.'];

if (typewriterEl && !prefersReducedMotion) {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
        const currentWord = typewriterWords[wordIndex];

        if (!deleting) {
            charIndex++;
            typewriterEl.textContent = currentWord.slice(0, charIndex);
            if (charIndex === currentWord.length) {
                deleting = true;
                setTimeout(typeLoop, 1400); // pause at full word
                return;
            }
        } else {
            charIndex--;
            typewriterEl.textContent = currentWord.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % typewriterWords.length;
            }
        }

        setTimeout(typeLoop, deleting ? 40 : 80);
    }

    typeLoop();
} else if (typewriterEl) {
    typewriterEl.textContent = typewriterWords[0];
}

// --- Scroll Progress Bar ---
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// --- Scroll To Top Button ---
const scrollTopBtn = document.getElementById('scroll-top-btn');

window.addEventListener('scroll', function() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}, { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

// --- Ripple Effect on Buttons ---
function attachRipple(el) {
    el.addEventListener('click', function(e) {
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

document.querySelectorAll('.btn, #theme-btn, #scroll-top-btn').forEach(attachRipple);

// --- 3D Tilt Effect on Project Cards (desktop only) ---
if (!isTouchDevice && !prefersReducedMotion) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6; // max ~6deg
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
}

// --- Ambient Particle Background ---
(function particleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    // Fewer particles on small/touch screens for performance
    const particleCount = isTouchDevice || window.innerWidth < 700 ? 25 : 55;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function getParticleColor() {
        return document.body.classList.contains('dark-theme')
            ? 'rgba(148, 163, 184, 0.5)'
            : 'rgba(15, 23, 42, 0.25)';
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.8 + 0.6,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const color = getParticleColor();
        ctx.fillStyle = color;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', function() {
        resize();
        createParticles();
    });
})();

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

themeBtn.addEventListener('click', function() {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');

    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    themeBtn.setAttribute('aria-pressed', isDark);
});

// Single Page Section Switcher Logic
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetSectionId = this.getAttribute('data-section');

        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the target section
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active nav link styling (drives the sliding underline in CSS)
        navLinks.forEach(l => l.classList.remove('active-link'));
        this.classList.add('active-link');

        // Re-trigger fade-in-up animations for cards inside the newly shown section
        const fadeEls = targetSection ? targetSection.querySelectorAll('.fade-in-up') : [];
        fadeEls.forEach(el => {
            el.classList.remove('in-view');
            // Force reflow so the animation can replay
            void el.offsetWidth;
            fadeObserver.observe(el);
        });
    });
});

// --- Mouse Spotlight Tracker (smooth eased follow, not instant snap) ---
if (window.matchMedia('(hover: hover)').matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    const ease = 0.12; // lower = smoother/laggier trail, higher = snappier

    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animateSpotlight() {
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        document.body.style.setProperty('--mouse-x', currentX + 'px');
        document.body.style.setProperty('--mouse-y', currentY + 'px');

        requestAnimationFrame(animateSpotlight);
    }

    animateSpotlight();
}

// --- Scroll Fade-In-Up (IntersectionObserver) ---
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in-up').forEach(el => fadeObserver.observe(el));