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

// --- Mouse Spotlight Tracker ---
// Only run on devices that actually support hover, to skip pointless work on touch devices
if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', function(e) {
        document.body.style.setProperty('--mouse-x', e.clientX + 'px');
        document.body.style.setProperty('--mouse-y', e.clientY + 'px');
    });
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